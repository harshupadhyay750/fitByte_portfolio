/*
  fitByte Developer Portfolio - Script & Logic
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
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
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
  // 3. Screenshots Device Carousel / Slider
  // ==========================================
  const slider = document.getElementById('showcase-slider');
  const infoCards = document.querySelectorAll('.info-card');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlide = 0;
  const totalSlides = infoCards.length;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentSlide = index;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Sync active info cards
    infoCards.forEach((card, i) => {
      if (i === currentSlide) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Event Listeners for controls
  btnPrev.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
  });

  btnNext.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
  });

  // Click direct info card to change slide
  infoCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      goToSlide(i);
    });
  });

  // Auto-play slider slowly, resets on user interaction
  let slideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 7000);

  const resetAutoplay = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 10000); // Slower interval after user overrides
  };

  btnPrev.addEventListener('click', resetAutoplay);
  btnNext.addEventListener('click', resetAutoplay);
  infoCards.forEach(c => c.addEventListener('click', resetAutoplay));

  // ==========================================
  // 4. Interactive Live fitByte Dashboard State
  // ==========================================
  
  // Elements to read/update
  const labelProtein = document.getElementById('label-protein');
  const labelCarbs = document.getElementById('label-carbs');
  const labelFat = document.getElementById('label-fat');
  
  const sliderProteinInput = document.getElementById('slider-protein');
  const sliderCarbsInput = document.getElementById('slider-carbs');
  const sliderFatInput = document.getElementById('slider-fat');

  const btnLogMeal = document.getElementById('btn-log-meal');
  const btnResetWidget = document.getElementById('btn-reset-widget');
  const btnAddWater = document.getElementById('widget-btn-add-water');

  const textRemaining = document.getElementById('widget-val-remaining');
  const textEaten = document.getElementById('widget-val-eaten');
  const textBurned = document.getElementById('widget-val-burned');
  const textGoal = document.getElementById('widget-val-goal');
  const textPercent = document.getElementById('widget-val-percent');
  const circleGauge = document.getElementById('widget-gauge-circle');

  const textProteinCurr = document.getElementById('widget-protein-curr');
  const textProteinTarget = document.getElementById('widget-protein-target');
  const barProtein = document.getElementById('bar-protein');

  const textCarbsCurr = document.getElementById('widget-carbs-curr');
  const textCarbsTarget = document.getElementById('widget-carbs-target');
  const barCarbs = document.getElementById('bar-carbs');

  const textFatCurr = document.getElementById('widget-fat-curr');
  const textFatTarget = document.getElementById('widget-fat-target');
  const barFat = document.getElementById('bar-fat');

  const textWaterCurr = document.getElementById('widget-water-curr');
  const barWater = document.getElementById('bar-water');

  // Initial Widget States matching screenshot dashboard metrics
  const initialState = {
    caloriesGoal: 2395,
    caloriesEaten: 420,
    caloriesBurned: 0,
    waterIntake: 0,
    waterGoal: 2500,
    proteinTarget: 179,
    carbsTarget: 239,
    fatTarget: 79,
    proteinCurrent: 20.5,
    carbsCurrent: 70.2,
    fatCurrent: 10.8
  };

  let widgetState = { ...initialState };

  // Calculate remaining calories and update all view components
  function updateWidget() {
    // 1. Calculations
    const remaining = widgetState.caloriesGoal - widgetState.caloriesEaten + widgetState.caloriesBurned;
    const eatenPercent = Math.min(Math.round((widgetState.caloriesEaten / widgetState.caloriesGoal) * 100), 100);

    // 2. Calorie Card Elements
    textRemaining.textContent = remaining;
    textEaten.textContent = widgetState.caloriesEaten;
    textBurned.textContent = widgetState.caloriesBurned;
    textGoal.textContent = widgetState.caloriesGoal;
    textPercent.textContent = eatenPercent;

    // 3. SVG Circle Gauge Offset
    // r=40, circumference = 2 * PI * r = 251.2
    const circumference = 251.2;
    const strokeDashoffset = circumference - (eatenPercent / 100) * circumference;
    circleGauge.style.strokeDashoffset = strokeDashoffset;

    // 4. Macro Slider Labels
    labelProtein.textContent = `${widgetState.proteinTarget} g`;
    labelCarbs.textContent = `${widgetState.carbsTarget} g`;
    labelFat.textContent = `${widgetState.fatTarget} g`;

    // 5. Recreated UI Targets
    textProteinTarget.textContent = widgetState.proteinTarget;
    textCarbsTarget.textContent = widgetState.carbsTarget;
    textFatTarget.textContent = widgetState.fatTarget;

    textProteinCurr.textContent = widgetState.proteinCurrent.toFixed(1);
    textCarbsCurr.textContent = widgetState.carbsCurrent.toFixed(1);
    textFatCurr.textContent = widgetState.fatCurrent.toFixed(1);

    // 6. Macro Progress Bar Widths
    const percentProtein = Math.min((widgetState.proteinCurrent / widgetState.proteinTarget) * 100, 100);
    const percentCarbs = Math.min((widgetState.carbsCurrent / widgetState.carbsTarget) * 100, 100);
    const percentFat = Math.min((widgetState.fatCurrent / widgetState.fatTarget) * 100, 100);

    barProtein.style.width = `${percentProtein}%`;
    barCarbs.style.width = `${percentCarbs}%`;
    barFat.style.width = `${percentFat}%`;

    // 7. Water Intake Bar & Text
    textWaterCurr.textContent = widgetState.waterIntake;
    const percentWater = Math.min((widgetState.waterIntake / widgetState.waterGoal) * 100, 100);
    barWater.style.width = `${percentWater}%`;
  }

  // Event handler - Sliders input changes target values
  sliderProteinInput.addEventListener('input', (e) => {
    widgetState.proteinTarget = parseInt(e.target.value);
    updateWidget();
  });

  sliderCarbsInput.addEventListener('input', (e) => {
    widgetState.carbsTarget = parseInt(e.target.value);
    updateWidget();
  });

  sliderFatInput.addEventListener('input', (e) => {
    widgetState.fatTarget = parseInt(e.target.value);
    updateWidget();
  });

  // Event handler - Log Mock Meal
  btnLogMeal.addEventListener('click', () => {
    widgetState.caloriesEaten += 420;
    
    // Increment macros relative to a healthy meal (dal chawal template)
    widgetState.proteinCurrent += 18.5; // +18.5g Protein
    widgetState.carbsCurrent += 62.0;   // +62g Carbs
    widgetState.fatCurrent += 9.5;      // +9.5g Fat

    // Trigger state change trigger animations
    const calorieVal = document.getElementById('app-widget-view');
    calorieVal.style.transform = 'scale(0.98)';
    setTimeout(() => {
      calorieVal.style.transform = 'scale(1)';
    }, 150);

    updateWidget();
  });

  // Event handler - Increment Water
  btnAddWater.addEventListener('click', () => {
    if (widgetState.waterIntake < widgetState.waterGoal) {
      widgetState.waterIntake += 250;
      
      const waterIcon = document.querySelector('.water-icon-circle');
      waterIcon.style.transform = 'scale(1.2)';
      setTimeout(() => {
        waterIcon.style.transform = 'scale(1)';
      }, 200);

      updateWidget();
    }
  });

  // Event handler - Reset Widget
  btnResetWidget.addEventListener('click', () => {
    widgetState = { ...initialState };
    
    // Reset range slider elements
    sliderProteinInput.value = initialState.proteinTarget;
    sliderCarbsInput.value = initialState.carbsTarget;
    sliderFatInput.value = initialState.fatTarget;

    updateWidget();
  });

  // Initialize interactive calculations
  updateWidget();
});
