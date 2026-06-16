/*
  fitByte Developer Portfolio - Script & Logic Overhaul
  Created for Harsh Upadhyay
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation Scroll & Active Highlights
  // ==========================================
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Add backdrop style to nav when scrolling down
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active link detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= (sectionTop - 220)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 2. Entrance Reveal Animations on Scroll
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 3. Theme Switcher Logic
  // ==========================================
  const themeButtons = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('fitbyte-portfolio-theme') || 'emerald';
  
  // Set initial theme
  document.body.dataset.theme = savedTheme;
  themeButtons.forEach(btn => {
    if (btn.dataset.theme === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      document.body.dataset.theme = theme;
      localStorage.setItem('fitbyte-portfolio-theme', theme);
      
      // Update active class
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Notify user via widget toast if widget is loaded
      showWidgetToast(`Theme changed: fitByte ${theme.charAt(0).toUpperCase() + theme.slice(1)}! 🎨`);
    });
  });

  // ==========================================
  // 4. Screenshots Device Carousel / Slider & Lightbox
  // ==========================================
  const slider = document.getElementById('showcase-slider');
  const infoCards = document.querySelectorAll('.showcase-info-cards .info-card');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlide = 0;
  const totalSlides = infoCards.length;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlide = index;
    if (slider) {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Sync active info cards
    infoCards.forEach((card, i) => {
      if (i === currentSlide) {
        card.classList.add('active');
        // Smooth scroll details card into view if mobile
        if (window.innerWidth < 992) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Event Listeners for controls
  if (btnPrev) {
    btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
  }

  // Click direct info card to change slide
  infoCards.forEach((card, i) => {
    card.addEventListener('click', () => goToSlide(i));
  });

  // Auto-play slider slowly, resets on user interaction
  let slideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 7000);

  const resetAutoplay = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 12000); // Slower interval after user overrides
  };

  if (btnPrev) btnPrev.addEventListener('click', resetAutoplay);
  if (btnNext) btnNext.addEventListener('click', resetAutoplay);
  infoCards.forEach(c => c.addEventListener('click', resetAutoplay));

  // Touch Swipe support for Carousel Mockup
  let touchStartX = 0;
  let touchEndX = 0;
  
  if (slider) {
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swipe Left (Next)
      goToSlide(currentSlide + 1);
      resetAutoplay();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swipe Right (Prev)
      goToSlide(currentSlide - 1);
      resetAutoplay();
    }
  }

  // Lightbox Zoom Modal Logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const zoomTriggers = document.querySelectorAll('.slide-zoom-trigger');
  
  let currentZoomIdx = 0;
  
  const slideDescriptions = [
    "Intuitive Onboarding: Welcome interface styled to deliver modern, dark-theme app entry.",
    "Firebase Google OAuth: Integrates profile selector support with cloud sync.",
    "Smart calorie & macros visual indicators dashboard ring gauge.",
    "AI vegetarian Indian strategy diet planner macro parameters calculator.",
    "Cloud automated logging syncing banner alerts feedback templates."
  ];

  function openLightbox(idx) {
    currentZoomIdx = idx;
    const trigger = zoomTriggers[idx];
    if (!trigger || !lightboxModal) return;
    
    const img = trigger.querySelector('img');
    lightboxImg.src = img.src;
    lightboxCaption.textContent = slideDescriptions[idx];
    lightboxModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }
  
  zoomTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const idx = parseInt(trigger.dataset.slideIdx);
      openLightbox(idx);
    });
  });
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  
  // Close lightbox on click outside the image
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
  
  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', () => {
      let prevIdx = currentZoomIdx - 1;
      if (prevIdx < 0) prevIdx = zoomTriggers.length - 1;
      openLightbox(prevIdx);
    });
  }
  
  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', () => {
      let nextIdx = currentZoomIdx + 1;
      if (nextIdx >= zoomTriggers.length) nextIdx = 0;
      openLightbox(nextIdx);
    });
  }

  // ==========================================
  // 5. Advanced Live fitByte Simulator Engine
  // ==========================================
  
  // Controls
  const sliderProtein = document.getElementById('slider-protein');
  const sliderCarbs = document.getElementById('slider-carbs');
  const sliderFat = document.getElementById('slider-fat');
  
  const selectMeal = document.getElementById('select-meal');
  const selectWorkout = document.getElementById('select-workout');
  
  const btnLogMeal = document.getElementById('btn-log-meal');
  const btnLogWorkout = document.getElementById('btn-log-workout');
  const btnResetWidget = document.getElementById('btn-reset-widget');
  const btnAddWater = document.getElementById('widget-btn-add-water');
  
  // App views
  const valRemaining = document.getElementById('widget-val-remaining');
  const valEaten = document.getElementById('widget-val-eaten');
  const valBurned = document.getElementById('widget-val-burned');
  const valGoal = document.getElementById('widget-val-goal');
  const valPercent = document.getElementById('widget-val-percent');
  const gaugeCircle = document.getElementById('widget-gauge-circle');
  
  const valProteinCurr = document.getElementById('widget-protein-curr');
  const valProteinTarget = document.getElementById('widget-protein-target');
  const barProtein = document.getElementById('bar-protein');
  
  const valCarbsCurr = document.getElementById('widget-carbs-curr');
  const valCarbsTarget = document.getElementById('widget-carbs-target');
  const barCarbs = document.getElementById('bar-carbs');
  
  const valFatCurr = document.getElementById('widget-fat-curr');
  const valFatTarget = document.getElementById('widget-fat-target');
  const barFat = document.getElementById('bar-fat');
  
  const valWaterCurr = document.getElementById('widget-water-curr');
  const barWater = document.getElementById('bar-water');
  
  const foodListContainer = document.getElementById('app-food-list');
  const noLogsMsg = document.getElementById('no-logs-msg');
  const toastContainer = document.getElementById('app-toast-container');

  // Food and exercise library databases
  const FOOD_DB = {
    oatmeal: { name: 'Oatmeal & Fruits', kcal: 350, p: 12.0, c: 60.0, f: 5.0, emoji: '🥣' },
    biryani: { name: 'Paneer Biryani & Raita', kcal: 580, p: 22.0, c: 85.0, f: 16.0, emoji: '🍛' },
    soya: { name: 'Soya Chunks & Dal Tadka', kcal: 480, p: 38.0, c: 50.0, f: 10.0, emoji: '🥗' },
    shake: { name: 'Whey Protein Shake', kcal: 180, p: 25.0, c: 5.0, f: 2.0, emoji: '🥤' },
    toast: { name: 'Avocado Toast', kcal: 320, p: 9.0, c: 35.0, f: 14.0, emoji: '🥑' },
    cheat: { name: 'Gulab Jamun', kcal: 290, p: 4.0, c: 45.0, f: 10.0, emoji: '🍡' }
  };
  
  const WORKOUT_DB = {
    running: { name: 'Running (30 min)', kcal: 350, emoji: '🏃' },
    strength: { name: 'Strength Training (45 min)', kcal: 250, emoji: '🏋️' },
    cycling: { name: 'Cycling (30 min)', kcal: 200, emoji: '🚴' },
    yoga: { name: 'Yoga (20 min)', kcal: 100, emoji: '🧘' }
  };

  const initialSimState = {
    caloriesGoal: 2395,
    caloriesEaten: 0,
    caloriesBurned: 0,
    waterIntake: 0,
    waterGoal: 2500,
    proteinTarget: 179,
    carbsTarget: 239,
    fatTarget: 79,
    proteinCurrent: 0.0,
    carbsCurrent: 0.0,
    fatCurrent: 0.0,
    loggedActivities: [] // Array of logs
  };

  let simState = { ...initialSimState };

  // Toast Banners System inside phone mockup
  function showWidgetToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    
    let icon = '<i class="fa-solid fa-circle-info" style="color: #3b82f6;"></i>';
    if (type === 'meal') icon = '<i class="fa-solid fa-utensils" style="color: var(--color-primary-light);"></i>';
    if (type === 'workout') icon = '<i class="fa-solid fa-dumbbell" style="color: #c084fc;"></i>';
    if (type === 'water') icon = '<i class="fa-solid fa-droplet" style="color: #3b82f6;"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    // Animate removal after delay
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 2500);
  }

  // Main UI Syncer
  function syncSimulator() {
    // 1. Calculations
    const remaining = simState.caloriesGoal - simState.caloriesEaten + simState.caloriesBurned;
    const eatenPercent = Math.min(Math.round((simState.caloriesEaten / simState.caloriesGoal) * 100), 100);

    // 2. Calorie Card Elements
    if (valRemaining) valRemaining.textContent = remaining;
    if (valEaten) valEaten.textContent = simState.caloriesEaten;
    if (valBurned) valBurned.textContent = simState.caloriesBurned;
    if (valGoal) valGoal.textContent = simState.caloriesGoal;
    if (valPercent) valPercent.textContent = eatenPercent;

    // 3. SVG Circle Gauge Offset
    // r=40, circumference = 2 * PI * r = 251.2
    if (gaugeCircle) {
      const circumference = 251.2;
      const strokeDashoffset = circumference - (eatenPercent / 100) * circumference;
      gaugeCircle.style.strokeDashoffset = strokeDashoffset;
    }

    // 4. Targets display
    const labelProtein = document.getElementById('label-protein');
    const labelCarbs = document.getElementById('label-carbs');
    const labelFat = document.getElementById('label-fat');
    
    if (labelProtein) labelProtein.textContent = `${simState.proteinTarget} g`;
    if (labelCarbs) labelCarbs.textContent = `${simState.carbsTarget} g`;
    if (labelFat) labelFat.textContent = `${simState.fatTarget} g`;

    if (valProteinTarget) valProteinTarget.textContent = simState.proteinTarget;
    if (valCarbsTarget) valCarbsTarget.textContent = simState.carbsTarget;
    if (valFatTarget) valFatTarget.textContent = simState.fatTarget;

    // 5. Current values display
    if (valProteinCurr) valProteinCurr.textContent = simState.proteinCurrent.toFixed(1);
    if (valCarbsCurr) valCarbsCurr.textContent = simState.carbsCurrent.toFixed(1);
    if (valFatCurr) valFatCurr.textContent = simState.fatCurrent.toFixed(1);

    // 6. Macro Progress Bar Widths
    const percentProtein = Math.min((simState.proteinCurrent / simState.proteinTarget) * 100, 100);
    const percentCarbs = Math.min((simState.carbsCurrent / simState.carbsTarget) * 100, 100);
    const percentFat = Math.min((simState.fatCurrent / simState.fatTarget) * 100, 100);

    if (barProtein) barProtein.style.width = `${percentProtein}%`;
    if (barCarbs) barCarbs.style.width = `${percentCarbs}%`;
    if (barFat) barFat.style.width = `${percentFat}%`;

    // 7. Water Intake Bar & Text
    if (valWaterCurr) valWaterCurr.textContent = simState.waterIntake;
    if (barWater) {
      const percentWater = Math.min((simState.waterIntake / simState.waterGoal) * 100, 100);
      barWater.style.width = `${percentWater}%`;
    }

    // 8. Render Dynamic Food Log items
    renderFoodLog();
  }

  function renderFoodLog() {
    if (!foodListContainer) return;
    
    // Clear list but save header if existed
    const items = foodListContainer.querySelectorAll('.food-log-item');
    items.forEach(el => el.remove());

    if (simState.loggedActivities.length === 0) {
      if (noLogsMsg) noLogsMsg.style.display = 'flex';
      return;
    }

    if (noLogsMsg) noLogsMsg.style.display = 'none';

    simState.loggedActivities.forEach((act, index) => {
      const item = document.createElement('div');
      item.className = `food-log-item ${act.type === 'workout' ? 'exercise-log' : ''}`;
      
      const details = document.createElement('div');
      details.className = 'food-item-details';
      
      const title = document.createElement('span');
      title.className = 'food-item-title';
      title.textContent = `${act.emoji} ${act.name}`;
      details.appendChild(title);
      
      if (act.type === 'meal') {
        const macros = document.createElement('span');
        macros.className = 'food-item-macros';
        macros.textContent = `P: ${act.p}g • C: ${act.c}g • F: ${act.f}g`;
        details.appendChild(macros);
      } else {
        const macros = document.createElement('span');
        macros.className = 'food-item-macros';
        macros.textContent = `Burned Calories logged`;
        details.appendChild(macros);
      }
      
      item.appendChild(details);
      
      const right = document.createElement('div');
      right.className = 'food-item-right';
      
      const kcalVal = document.createElement('span');
      kcalVal.className = 'food-item-kcal';
      kcalVal.textContent = `${act.type === 'workout' ? '-' : '+'}${act.kcal} kcal`;
      right.appendChild(kcalVal);
      
      const delBtn = document.createElement('button');
      delBtn.className = 'food-item-delete';
      delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      delBtn.setAttribute('aria-label', `Delete ${act.name}`);
      delBtn.addEventListener('click', () => deleteLoggedItem(index));
      right.appendChild(delBtn);
      
      item.appendChild(right);
      foodListContainer.appendChild(item);
    });
  }

  // Log a meal logic
  function logMeal(key) {
    const meal = FOOD_DB[key];
    if (!meal) return;
    
    simState.caloriesEaten += meal.kcal;
    simState.proteinCurrent += meal.p;
    simState.carbsCurrent += meal.c;
    simState.fatCurrent += meal.f;
    
    simState.loggedActivities.push({
      type: 'meal',
      id: key,
      name: meal.name,
      kcal: meal.kcal,
      p: meal.p,
      c: meal.c,
      f: meal.f,
      emoji: meal.emoji
    });
    
    // Scale bump feedback animation
    animateMockupScreen();
    showWidgetToast(`Logged ${meal.name} ${meal.emoji}`, 'meal');
    syncSimulator();
  }

  // Log workout logic
  function logWorkout(key) {
    const w = WORKOUT_DB[key];
    if (!w) return;
    
    simState.caloriesBurned += w.kcal;
    
    simState.loggedActivities.push({
      type: 'workout',
      id: key,
      name: w.name,
      kcal: w.kcal,
      emoji: w.emoji
    });
    
    animateMockupScreen();
    showWidgetToast(`Logged: ${w.name} ${w.emoji}`, 'workout');
    syncSimulator();
  }

  // Delete logged item logic
  function deleteLoggedItem(idx) {
    const act = simState.loggedActivities[idx];
    if (!act) return;
    
    if (act.type === 'meal') {
      simState.caloriesEaten -= act.kcal;
      simState.proteinCurrent -= act.p;
      simState.carbsCurrent -= act.c;
      simState.fatCurrent -= act.f;
    } else {
      simState.caloriesBurned -= act.kcal;
    }
    
    simState.loggedActivities.splice(idx, 1);
    showWidgetToast(`Removed: ${act.name}`, 'info');
    syncSimulator();
  }

  function animateMockupScreen() {
    const widgetView = document.getElementById('app-widget-view');
    if (widgetView) {
      widgetView.style.transform = 'scale(0.98)';
      setTimeout(() => {
        widgetView.style.transform = 'scale(1)';
      }, 150);
    }
  }

  // Bind sliders
  if (sliderProtein) {
    sliderProtein.addEventListener('input', (e) => {
      simState.proteinTarget = parseInt(e.target.value);
      syncSimulator();
    });
  }
  if (sliderCarbs) {
    sliderCarbs.addEventListener('input', (e) => {
      simState.carbsTarget = parseInt(e.target.value);
      syncSimulator();
    });
  }
  if (sliderFat) {
    sliderFat.addEventListener('input', (e) => {
      simState.fatTarget = parseInt(e.target.value);
      syncSimulator();
    });
  }

  // Bind Buttons
  if (btnLogMeal) {
    btnLogMeal.addEventListener('click', () => {
      if (selectMeal) logMeal(selectMeal.value);
    });
  }
  
  if (btnLogWorkout) {
    btnLogWorkout.addEventListener('click', () => {
      if (selectWorkout) logWorkout(selectWorkout.value);
    });
  }
  
  if (btnAddWater) {
    btnAddWater.addEventListener('click', () => {
      if (simState.waterIntake < simState.waterGoal) {
        simState.waterIntake += 250;
        
        // Water icon splash micro-animation
        const waterIcon = document.querySelector('.water-icon-circle');
        if (waterIcon) {
          waterIcon.style.transform = 'scale(1.3) rotate(15deg)';
          setTimeout(() => {
            waterIcon.style.transform = 'scale(1)';
          }, 200);
        }
        
        showWidgetToast('Drank 250ml Water 💧', 'water');
        syncSimulator();
      } else {
        showWidgetToast('Water Target Reached! 🏆', 'water');
      }
    });
  }

  if (btnResetWidget) {
    btnResetWidget.addEventListener('click', () => {
      simState = { ...initialSimState, loggedActivities: [] };
      
      // Reset sliders representation
      if (sliderProtein) sliderProtein.value = initialSimState.proteinTarget;
      if (sliderCarbs) sliderCarbs.value = initialSimState.carbsTarget;
      if (sliderFat) sliderFat.value = initialSimState.fatTarget;
      
      showWidgetToast('Widget tracking reset 🔄');
      syncSimulator();
    });
  }

  // ==========================================
  // 6. AI Diet Coach Chatbot Simulator
  // ==========================================
  const chatOverlay = document.getElementById('app-chat-overlay');
  const chatMessagesContainer = document.getElementById('chat-messages');
  const btnChatClose = document.getElementById('btn-chat-close');
  const toolSuggestClick = document.getElementById('tool-suggest-click');
  const promptButtons = document.querySelectorAll('.chat-prompt-btn');
  
  let chatOpen = false;

  function toggleChat(state) {
    chatOpen = state;
    if (chatOverlay) {
      if (chatOpen) {
        chatOverlay.classList.add('active');
        // Type a contextual greeting message
        renderCoachMessage("Hello! Let's analyze your targets. Click a prompt below to request meal suggestions or diet strategies!");
      } else {
        chatOverlay.classList.remove('active');
      }
    }
  }

  if (toolSuggestClick) {
    toolSuggestClick.addEventListener('click', () => toggleChat(true));
  }
  if (btnChatClose) {
    btnChatClose.addEventListener('click', () => toggleChat(false));
  }

  // Preset prompts logic
  promptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.prompt;
      const userText = btn.textContent;
      
      // Render user bubble
      renderUserMessage(userText);
      
      // Generate bot dynamic response based on current metrics
      setTimeout(() => {
        generateCoachResponse(type);
      }, 600);
    });
  });

  function renderUserMessage(text) {
    if (!chatMessagesContainer) return;
    const msg = document.createElement('div');
    msg.className = 'message msg-user';
    msg.textContent = text;
    chatMessagesContainer.appendChild(msg);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function renderCoachMessage(text) {
    if (!chatMessagesContainer) return;
    
    // Visual typing bubble indicator
    const typingBubble = document.createElement('div');
    typingBubble.className = 'message msg-bot typing';
    typingBubble.innerHTML = '<span style="opacity: 0.5;">typing...</span>';
    chatMessagesContainer.appendChild(typingBubble);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    
    setTimeout(() => {
      typingBubble.remove();
      const msg = document.createElement('div');
      msg.className = 'message msg-bot';
      msg.innerHTML = text;
      chatMessagesContainer.appendChild(msg);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }, 800);
  }

  function generateCoachResponse(promptType) {
    // Math checks
    const remainingP = Math.max(simState.proteinTarget - simState.proteinCurrent, 0);
    const remainingC = Math.max(simState.carbsTarget - simState.carbsCurrent, 0);
    
    let botReply = '';
    
    if (promptType === 'suggest_snack') {
      if (remainingP > 40) {
        botReply = `You need protein! I suggest a **Whey Protein Shake** 🥤 (25g Protein) or **100g Grilled Paneer** 🧀 (18g Protein) to hit your targets easily.`;
      } else if (remainingC > 50) {
        botReply = `You have carb room left! Grab **Oatmeal & Banana** 🥣 (60g Carbs) or **two slices of Whole Wheat Toast** 🍞 for a healthy training snack.`;
      } else {
        botReply = `Your macro profile is balanced. Grab a **healthy handful of mixed almonds and walnuts** 🥜 (approx 150 kcal) to satisfy snack cravings.`;
      }
    } else if (promptType === 'hit_protein') {
      botReply = `Since fitByte targets a vegetarian diet strategy, your best protein sources are:<br>
      1. **Soya Chunks** (52g Protein per 100g)<br>
      2. **Tofu / Paneer** (18g-20g Protein per 100g)<br>
      3. **Double Scoop Whey** (50g Protein)<br>
      You still need **${remainingP.toFixed(0)}g** of Protein today!`;
    } else if (promptType === 'low_carb') {
      botReply = `For low-carb strategies, focus on foods like **Greek Yogurt, Sautéed Broccoli, Spinach Paneer**, or a **Sprout salad** loaded with lemon. Avoid Biryani or sweets if your carb limit is close!`;
    }
    
    renderCoachMessage(botReply);
  }

  // Bind click tools triggers
  const toolWorkoutClick = document.getElementById('tool-workout-click');
  const toolCalcClick = document.getElementById('tool-calc-click');
  
  if (toolWorkoutClick) {
    toolWorkoutClick.addEventListener('click', () => {
      showWidgetToast("Select 'Log Mock Exercise' dropdown in the control panel to add workouts!", 'info');
      // Scroll user slightly to widget controls on desktop
      if (window.innerWidth >= 992) {
        document.querySelector('.widget-controls-card').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  if (toolCalcClick) {
    toolCalcClick.addEventListener('click', () => {
      const w = 75; // weight placeholder
      const calcP = Math.round(w * 2.2);
      const calcC = Math.round(w * 3);
      const calcF = Math.round(w * 0.9);
      showWidgetToast(`Weight Calculation (${w}kg): Set Protein to ${calcP}g, Carbs to ${calcC}g.`, 'info');
      
      // Sync sliders values automatically
      if (sliderProtein) {
        sliderProtein.value = calcP;
        simState.proteinTarget = calcP;
      }
      if (sliderCarbs) {
        sliderCarbs.value = calcC;
        simState.carbsTarget = calcC;
      }
      if (sliderFat) {
        sliderFat.value = calcF;
        simState.fatTarget = calcF;
      }
      syncSimulator();
    });
  }

  // ==========================================
  // 7. Skills Categories Filters & Detailed Popups
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCategories = document.querySelectorAll('.skill-category');
  const skillItems = document.querySelectorAll('.skill-item');
  const explanationBox = document.getElementById('skill-explanation-box');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active btn styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter grid items
      skillCategories.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.classList.remove('hidden');
        } else {
          cat.classList.add('hidden');
        }
      });
    });
  });

  // Skills interactive descriptions
  skillItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove outline highlight from others
      skillItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      
      const descText = item.dataset.desc;
      const name = item.querySelector('.skill-name').textContent;
      
      if (explanationBox && descText) {
        explanationBox.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-primary-light);"></i> <div><span>${name}</span>: ${descText}</div>`;
        explanationBox.style.transform = 'scale(1.02)';
        setTimeout(() => {
          explanationBox.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });

  // ==========================================
  // 9. Contact Form submission & Confetti Burst
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm && formSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Save button original state
      const originalBtnHTML = formSubmitBtn.innerHTML;
      
      // Loading state on button
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<span class="btn-loader"></span> Sending Message...';
      
      // Simulate form submission API call
      setTimeout(() => {
        // Success state
        formSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent Successfully!';
        formSubmitBtn.style.background = 'var(--color-primary-light)';
        
        // Trigger CSS confetti burst
        triggerConfetti();
        
        alert("Message submitted! Thank you for connecting with Harsh Upadhyay.");
        
        // Reset after duration
        setTimeout(() => {
          contactForm.reset();
          formSubmitBtn.disabled = false;
          formSubmitBtn.innerHTML = originalBtnHTML;
          formSubmitBtn.style.background = ''; // restore variables color
        }, 3000);
      }, 1500);
    });
  }

  function triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#3f8948', '#52a65b', '#3b5bdb', '#3a86c8', '#ffd700', '#ff4500'];
    const numConfetti = 50;

    for (let i = 0; i < numConfetti; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${Math.random() * 10 + 5}px`;
      piece.style.height = piece.style.width;
      
      // Randomize animation delays and positions
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      container.appendChild(piece);
    }

    // Clean up container
    setTimeout(() => {
      container.remove();
    }, 3000);
  }

  // ==========================================
  // 10. Initialization
  // ==========================================
  // Sync the food tracker widget on page load
  syncSimulator();

});
