document.addEventListener("DOMContentLoaded", function () {
  const toggleContainer = document.getElementById("toggle-container");
  const svgObject = document.getElementById("svg-object");
  const floorImage = document.querySelector("img");

  //list of all labels there are
  const elementsToToggle = [
    { id: "classrooms", label: "Classrooms" },
    { id: "tech_infrastructure", label: "Tech Infrastructure" },
    { id: "admin_offices", label: "Admin Offices" },
    { id: "faculty_offices", label: "Faculty Offices" },
    { id: "centers", label: "Centers" },
    { id: "tech_ops_facilities", label: "Tech Ops Facilities" },
    { id: "bathrooms", label: "Bathrooms" },
    { id: "storage", label: "Storage" },
    { id: "media_center", label: "Media Center" },
    { id: "external", label: "External" },
    { id: "phd_suites", label: "PHD Suites" },
    { id: "conference_room", label: "Conference Rooms" },
    { id: "tech_ops_it", label: "Tech Ops IT" },
    { id: "studios", label: "Studios" },
    { id: "editing", label: "Editing Rooms" },
    { id: "digital_lounge", label: "Digital Lounge" },
  ];

  let currentSvgLoadHandler;

  // function to set up checkboxes based on the elements
  function setupToggleUI(svgDoc) {
    //clears existing
    toggleContainer.innerHTML = "";

    // select all label
    const selectAllLabel = document.createElement("label");
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.className = "select-all-checkbox";

    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.appendChild(document.createTextNode(" Select All"));
    toggleContainer.appendChild(selectAllLabel);

    const validCheckboxes = [];

    elementsToToggle.forEach((element) => {
      if (!element.id) return; // skip empty config
      const targetElement = svgDoc.getElementById(element.id);
      if (targetElement) {
        //default set display to none
        targetElement.style.display = "none";
        //create checkbox for it
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "toggle-checkbox";
        checkbox.setAttribute("data-target", element.id);
        //changes based on if it is checked or not
        checkbox.addEventListener("change", () => {
          targetElement.style.display = checkbox.checked ? "block" : "none";
          selectAllCheckbox.checked = validCheckboxes.every((cb) => cb.checked);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${element.label}`));
        toggleContainer.appendChild(label);
        validCheckboxes.push(checkbox);
      }
    });

    // Select all logic
    selectAllCheckbox.addEventListener("change", () => {
      const show = selectAllCheckbox.checked;
      validCheckboxes.forEach((checkbox) => {
        checkbox.checked = show;
        const id = checkbox.getAttribute("data-target");
        const el = svgDoc.getElementById(id);
        if (el) el.style.display = show ? "block" : "none";
      });
    });
  }

  // Load a new floor
  function loadFloor(floorKey) {
    if (!floors[floorKey]) return;
    svgObject.classList.add("invisible");

    floorImage.src = floors[floorKey].image;
    svgObject.data = floors[floorKey].svg;

    // Remove previous load listener if it exists
    if (currentSvgLoadHandler) {
      svgObject.removeEventListener("load", currentSvgLoadHandler);
    }

    // Set new handler
    currentSvgLoadHandler = function () {
      const svgDoc = svgObject.contentDocument;
      if (svgDoc) {
        setupToggleUI(svgDoc);
        svgObject.classList.remove("invisible"); // Reveal after setup
      }
    };

    svgObject.addEventListener("load", currentSvgLoadHandler);
  }

  // Bind floor tab buttons
  document.querySelectorAll(".floor-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const floorKey = tab.getAttribute("data-floor");
      loadFloor(floorKey);
    });
  });

  // Load default floor
  loadFloor("floor1");
});
