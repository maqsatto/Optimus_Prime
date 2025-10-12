document.addEventListener("DOMContentLoaded", () => {

  const section = document.createElement("section");
  section.className = "datetime-section text-center my-4";

  const title = document.createElement("h5");
  title.textContent = "Current Date & Time";
  title.className = "text-warning";

  const datetime = document.createElement("p");
  datetime.id = "datetime";
  datetime.className = "text-warning fs-5";

  section.appendChild(title);
  section.appendChild(datetime);

  const main = document.querySelector("main") || document.body;
  if (main.firstChild) {
    main.insertBefore(section, main.firstChild);
  } else {
    main.appendChild(section);
  }

  function updateDateTime() {
    const now = new Date();

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    datetime.textContent = now.toLocaleString("en-US", options).replace(",", "");
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
});
