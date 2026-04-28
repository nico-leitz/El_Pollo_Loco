const startBtnRef = document.getElementById("start_game_btn");

startBtnRef.addEventListener('click', () => {
   let startScreen = document.getElementById('start_screen');
   startScreen.classList.add('d_none');
   startBtnRef.classList.add('d_none');
   init();
});