document.addEventListener('DOMContentLoaded', () => {
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const formSignin = document.getElementById('form-signin');
  const formSignup = document.getElementById('form-signup');

  tabSignin.addEventListener('click', () => {
    tabSignin.classList.add('active');
    tabSignup.classList.remove('active');
    formSignin.classList.remove('hidden');
    formSignup.classList.add('hidden');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabSignin.classList.remove('active');
    formSignup.classList.remove('hidden');
    formSignin.classList.add('hidden');
  });
});
