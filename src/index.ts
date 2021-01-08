const passwordField: any = document.getElementById('password');
const maskField: any = document.getElementById('mask');
const result: any = document.getElementById('result');
const button: any = document.getElementById('mask-action');

const maskFunction = (password, mask) => {
  return mask
    .reduce((acc, maskNumber) => {
      acc.push(password[maskNumber - 1]);
      return acc;
    }, [])
    .join('');
};

button.onclick = (event) => {
  event.preventDefault();
  const password = passwordField.value;
  const mask = maskField.value
    .split(' ')
    .filter((str) => str && !isNaN(str))
    .map((str) => Number(str))
    .filter((number) => number > 0 && password.length >= number);

  const res = maskFunction(password, mask);
  result.innerHTML = res;
};
