// Import our custom CSS
import '../scss/style.scss';

const form = document.querySelector("form") as HTMLFormElement;

form.addEventListener("submit", (event: Event) => {
    event.preventDefault();
})