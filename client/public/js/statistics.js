// ********************* dark mode ********************* //
const themeToggler = document.querySelector(".theme-toggler");

const container = document.body;
if (localStorage.getItem("data-theme")) {
  container.setAttribute("data-theme", localStorage.getItem("data-theme"));
  console.log(localStorage.getItem("data-theme"));
  if (localStorage.getItem("data-theme") === "dark") {
    document.body.classList.toggle("dark-theme-variables");
    themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
    themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
  }
  toggleDark(0);
}

function toggleDark(r) {
  const dataTheme = localStorage.getItem("data-theme");
  let theme_switch;
  if (dataTheme === "light") {
    theme_switch = 1;
  } else {
    theme_switch = 0;
  }
  if (r) {
    console.log(theme_switch);
    theme_switch = !theme_switch;
    console.log(theme_switch);
  }
  if (theme_switch) {
    localStorage.setItem("data-theme", "light");
    console.log("light");
  } else {
    localStorage.setItem("data-theme", "dark");
    console.log("dark");
  }
}

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
  toggleDark(1);
});
// ********************* Format date ********************* //
function formatDate(date) {
  const timeStamp = new Date(date).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  const time = timeStamp.replace(", ", " - ");
  return time;
}

// ********************* Display data ********************* //
let checkBtnShow = 0;
function createButton(rowElement, data) {
  const containerButton = document.createElement("div");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerHTML = "Edit";
  editButton.setAttribute("data-id", data.ss_id);
  editButton.setAttribute("onclick", "openPopup()");
  containerButton.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("data-id", data.id);
  containerButton.appendChild(deleteButton);
  containerButton.classList.add("flex-row");

  rowElement.appendChild(containerButton);
}
let checkData;
let checkSearch;
let inputValue;
let testLength;
let currentPage = 0;

async function loadIntoTable(url, table) {
  checkSearch = 0;
  const tableBody = table.querySelector("tbody");

  const response = await fetch(url);
  const { data } = await response.json();
  checkData = data;
  testLength = Math.ceil(data.length / 10);
  createPageNumber(data.length);

  if (data.length > 10) {
    for (let i = 0; i < 10; i++) {
      const rowElement = document.createElement("tr");

      const cellElement1 = document.createElement("td");
      cellElement1.textContent = data[i].name;
      rowElement.appendChild(cellElement1);

      const cellElement2 = document.createElement("td");
      cellElement2.textContent = data[i].temp;
      rowElement.appendChild(cellElement2);

      const cellElement3 = document.createElement("td");
      cellElement3.textContent = data[i].humidity;
      rowElement.appendChild(cellElement3);

      const cellElement4 = document.createElement("td");
      cellElement4.textContent = data[i].light;
      rowElement.appendChild(cellElement4);

      const cellElement6 = document.createElement("td");
      cellElement6.textContent = data[i].location;
      rowElement.appendChild(cellElement6);

      const cellElement7 = document.createElement("td");
      cellElement7.textContent = formatDate(data[i].created_at);
      rowElement.appendChild(cellElement7);

      createButton(rowElement, data[i]);

      tableBody.appendChild(rowElement);
    }
  } else if (data.length < 10) {
    for (let i = 0; i < data.length; i++) {
      const rowElement = document.createElement("tr");

      const cellElement1 = document.createElement("td");
      cellElement1.textContent = data[i].name;
      rowElement.appendChild(cellElement1);

      const cellElement2 = document.createElement("td");
      cellElement2.textContent = data[i].temp;
      rowElement.appendChild(cellElement2);

      const cellElement3 = document.createElement("td");
      cellElement3.textContent = data[i].humidity;
      rowElement.appendChild(cellElement3);

      const cellElement4 = document.createElement("td");
      cellElement4.textContent = data[i].light;
      rowElement.appendChild(cellElement4);

      const cellElement6 = document.createElement("td");
      cellElement6.textContent = data[i].location;
      rowElement.appendChild(cellElement6);

      const cellElement7 = document.createElement("td");
      cellElement7.textContent = formatDate(data[i].created_at);
      rowElement.appendChild(cellElement7);

      createButton(rowElement, data[i]);

      tableBody.appendChild(rowElement);
    }
  }
}

function createPageNumber(a) {
  const pages = document.querySelector(".pagination .pages");
  const numberCheck = Math.ceil(a / 10);

  if (numberCheck > 8) {
    for (let i = 0; i < 7; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i + 1;
      if (i === 0) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  } else {
    for (let i = 0; i < numberCheck; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i + 1;
      if (i === 0) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  }
}

let checkIndex = 0;
let getIndex = 0;

async function createNextPageNumber(a, b) {
  let usedUrl;
  if (checkSearch === 1) {
    usedUrl = `http://localhost:3000/search/${inputValue}`;
  } else {
    usedUrl = "http://localhost:3000/get-all-data";
  }
  checkIndex = b - 1;
  const pages = document.querySelector(".pagination .pages");
  if (b > a - 6) {
    for (let i = a - 7; i < a; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i + 1;
      if (i === b) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  } else if (a < 8) {
    for (let i = b - 1; i < a; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i + 1;
      if (i === b) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  } else {
    for (let i = b - 1; i < b + 6 && i < a; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i + 1;
      if (i === b) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  }
  const pageNumbers = document.querySelectorAll(".page-number");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  function updateButtons() {
    prevButton.disabled = getIndex === 1;
    nextButton.disabled = getIndex === a - 1;
  }

  function setActive() {
    pageNumbers.forEach((page, index) => {
      if (b === index) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });
  }
  pageNumbers.forEach((page, index) => {
    page.addEventListener("click", function () {
      const loadingSpinner = document.getElementById("loadingSpinner");
      loadingSpinner.style.display = "block";
      setTimeout(() => {
        loadingSpinner.style.display = "none";
        nextButton.disabled = false;
        prevButton.disabled = false;
        b = index;
        checkIndex = 1;
        getIndex = pageNumbers[index].innerHTML - 1;
        console.log(getIndex);
        showPageTest(document.querySelector("table"), getIndex, usedUrl);
        updateButtons();
        setActive();
      }, 1000);
      nextButton.disabled = true;
      prevButton.disabled = true;
    });
  });
}

function createPrevPageNumber(a, b) {
  let usedUrl;
  if (checkSearch === 1) {
    usedUrl = `http://localhost:3000/search/${inputValue}`;
  } else {
    usedUrl = "http://localhost:3000/get-all-data";
  }
  const pages = document.querySelector(".pagination .pages");
  if (b === 0) {
    for (let i = b + 1; i < b + 8 && i < a; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i;
      if (i === b + 1) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  } else if (b > a - 6) {
    for (let i = a - 6; i < a + 1; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i;
      if (i === b + 1) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  } else {
    for (let i = b - 1; i < b + 6 && i < a; i++) {
      const newPage = document.createElement("div");
      newPage.classList.add("page-number");
      newPage.innerHTML = i + 1;
      if (i === b) {
        newPage.classList.add("active");
      }
      pages.appendChild(newPage);
    }
  }
  const pageNumbers = document.querySelectorAll(".page-number");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  function updateButtons() {
    prevButton.disabled = getIndex === 0;
    nextButton.disabled = getIndex === a - 1;
  }

  function setActive() {
    pageNumbers.forEach((page, index) => {
      if (b === index) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });
  }
  pageNumbers.forEach((page, index) => {
    page.addEventListener("click", function () {
      const loadingSpinner = document.getElementById("loadingSpinner");
      loadingSpinner.style.display = "block";
      setTimeout(() => {
        loadingSpinner.style.display = "none";
        nextButton.disabled = false;
        prevButton.disabled = false;
        b = index;
        checkIndex = 1;
        getIndex = pageNumbers[index].innerHTML - 1;
        console.log(getIndex);
        showPageTest(document.querySelector("table"), getIndex, usedUrl);
        updateButtons();
        setActive();
      }, 1000);
      nextButton.disabled = true;
      prevButton.disabled = true;
    });
  });
}

// ********************* Search data ********************* //
let search = document.querySelector(".search");

search.onclick = function () {
  document.querySelector(".search-bar").classList.toggle("active");
};

let input = document.getElementById("search");

input.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    currentPage = 0;
    getIndex = 0
    event.preventDefault();
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    prevButton.disabled = true;
    nextButton.disabled = false;
    document.querySelector(".pagination .pages").innerHTML = "";
    let tbodyElement = document.querySelector("tbody");
    tbodyElement.innerHTML = "";

    await loadIntoTable(
      `http://localhost:3000/search/${input.value}`,
      document.querySelector("table")
    );
    inputValue = input.value;
    checkBtnShow = 1;
    checkSearch = 1;
    console.log(currentPage);
    const pageNumbers = document.querySelectorAll(".page-number");
    function updateButtons() {
      prevButton.disabled = currentPage === 0;
      nextButton.disabled = currentPage === testLength - 1;
    }

    function setActive() {
      pageNumbers.forEach((page, index) => {
        if (currentPage === index) {
          page.classList.add("active");
        } else {
          page.classList.remove("active");
        }
      });
    }
    pageNumbers.forEach((page, index) => {
      page.addEventListener("click", function () {
        const loadingSpinner = document.getElementById("loadingSpinner");
        loadingSpinner.style.display = "block";
        setTimeout(() => {
          loadingSpinner.style.display = "none";
          nextButton.disabled = false;
          prevButton.disabled = false;
          currentPage = index;
          showPageTest(document.querySelector("table"), currentPage, `http://localhost:3000/search/${input.value}`);
          updateButtons();
          setActive();
        }, 1000);
        nextButton.disabled = true;
        prevButton.disabled = true;
      });
    });
  }
});

// ********************* Delete and update data ********************* //
function deleteRowById(id) {
  fetch(`http://localhost:3000/delete/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "delete-button") {
      event.preventDefault();
      deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-button") {
      event.preventDefault();
      handleEditData(event.target.dataset.id);
    }
  });

let popup = document.getElementById("popup1");

function openPopup() {
  popup.classList.add("open-popup");
  document.querySelector(".container").classList.add("blur");
}

function closePopup() {
  popup.classList.remove("open-popup");
  document.querySelector(".container").classList.remove("blur");
}

function handleEditData(id) {
  document.querySelector("#name-data").dataset.id = id;
  document.querySelector("#location-data").dataset.id = id;
}

function updateData() {
  const updatePlaceInput = document.querySelector("#name-data");
  const updateLocationInput = document.querySelector("#location-data");

  console.log(updatePlaceInput, updateLocationInput);
  console.log(updatePlaceInput.dataset.id);
  console.log(updatePlaceInput.value);
  console.log(updateLocationInput.value);
  if (updatePlaceInput.value === "" || updateLocationInput.value === "") {
    alert("Place or Location isn't empty!");
  } else {
    fetch("http://localhost:3000/update", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: updatePlaceInput.dataset.id,
        name: updatePlaceInput.value,
        location: updateLocationInput.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        }
      });
  }
}

// ********************* Button show all ********************* //
async function loadIntoAllTable(table) {
  const tableBody = table.querySelector("tbody");
  tableBody.innerHTML = "";

  if (tableBody.rows.length < checkData.length) {
    
    for (let i = 0; i < checkData.length; i++) {
      const rowElement = document.createElement("tr");

      const cellElement1 = document.createElement("td");
      cellElement1.textContent = checkData[i].name;
      rowElement.appendChild(cellElement1);

      const cellElement2 = document.createElement("td");
      cellElement2.textContent = checkData[i].temp;
      rowElement.appendChild(cellElement2);

      const cellElement3 = document.createElement("td");
      cellElement3.textContent = checkData[i].humidity;
      rowElement.appendChild(cellElement3);

      const cellElement4 = document.createElement("td");
      cellElement4.textContent = checkData[i].light;
      rowElement.appendChild(cellElement4);

      const cellElement6 = document.createElement("td");
      cellElement6.textContent = checkData[i].location;
      rowElement.appendChild(cellElement6);

      const cellElement7 = document.createElement("td");
      cellElement7.textContent = formatDate(checkData[i].created_at);
      rowElement.appendChild(cellElement7);

      createButton(rowElement, checkData[i]);

      tableBody.appendChild(rowElement);
    }
  } else if (tableBody.rows.length === checkData.length) {
    for (let i = 10; i < checkData.length; i++) {
      tableBody.rows[tableBody.rows.length - 1].remove();
    }
  }
}

// let btnShowAll = document.querySelector(".submit");

// btnShowAll.addEventListener("click", function (event) {
//   if (checkBtnShow === 0) {
//     event.preventDefault();
//     loadIntoAllTable(document.querySelector("table"));
//   } else if (checkBtnShow === 1) {
//     event.preventDefault();
//     loadIntoAllTable(document.querySelector("table"));
//   }
// });

// ********************* Pagination ********************* //
async function showPageTest(table, currentPage, url) {
  const tableBody = table.querySelector("tbody");
  tableBody.innerHTML = "";
  const response = await fetch(url);
  const { data } = await response.json();

  const startIndex = currentPage * 10;
  const endIndex = startIndex + 10;

  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    const rowElement = document.createElement("tr");

    const cellElement1 = document.createElement("td");
    cellElement1.textContent = data[i].name;
    rowElement.appendChild(cellElement1);

    const cellElement2 = document.createElement("td");
    cellElement2.textContent = data[i].temp;
    rowElement.appendChild(cellElement2);

    const cellElement3 = document.createElement("td");
    cellElement3.textContent = data[i].humidity;
    rowElement.appendChild(cellElement3);

    const cellElement4 = document.createElement("td");
    cellElement4.textContent = data[i].light;
    rowElement.appendChild(cellElement4);

    const cellElement6 = document.createElement("td");
    cellElement6.textContent = data[i].location;
    rowElement.appendChild(cellElement6);

    const cellElement7 = document.createElement("td");
    cellElement7.textContent = formatDate(data[i].created_at);
    rowElement.appendChild(cellElement7);

    createButton(rowElement, data[i]);

    tableBody.appendChild(rowElement);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadIntoTable(
    "http://localhost:3000/get-all-data",
    document.querySelector("table")
  );
  const pageNumbers = document.querySelectorAll(".page-number");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");
  currentPage = 0;
  const response = await fetch("http://localhost:3000/get-all-data");
  const { data } = await response.json();
  let lastPage = Math.ceil(data.length / 10);
  const pages = document.querySelector(".pagination .pages");

  function updateButtons() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === lastPage - 1;
  }

  function setActive() {
    pageNumbers.forEach((page, index) => {
      if (currentPage === index) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });
  }

  pageNumbers.forEach((page, index) => {
    page.addEventListener("click", function () {
      const loadingSpinner = document.getElementById("loadingSpinner");
      loadingSpinner.style.display = "block";
      setTimeout(() => {
        loadingSpinner.style.display = "none";
        nextButton.disabled = false;
        prevButton.disabled = false;
        currentPage = index;
        showPageTest(
          document.querySelector("table"),
          currentPage,
          "http://localhost:3000/get-all-data"
        );
        updateButtons();
        setActive();
      }, 1000);
      nextButton.disabled = true;
      prevButton.disabled = true;
    });
  });

  prevButton.addEventListener("click", function () {
    let usedUrl;
    if (checkSearch === 1) {
      usedUrl = `http://localhost:3000/search/${inputValue}`;
      lastPage = testLength;
    } else {
      usedUrl = "http://localhost:3000/get-all-data";
    }
    if (currentPage > 0 || getIndex > 0) {
      if (checkIndex === 1) {
        currentPage = getIndex - 1;
      } else {
        currentPage--;
      }

      const loadingSpinner = document.getElementById("loadingSpinner");
      loadingSpinner.style.display = "block";
      setTimeout(() => {
        loadingSpinner.style.display = "none";
        prevButton.disabled = false;
        nextButton.disabled = true;

        pages.innerHTML = "";
        createPrevPageNumber(lastPage, currentPage);
        showPageTest(document.querySelector("table"), currentPage, usedUrl);
        updateButtons();
        setActive();
        checkIndex = 0;
      }, 1000);
      prevButton.disabled = true;
      nextButton.disabled = true;
    }
  });

  nextButton.addEventListener("click", function () {
    let usedUrl;
    if (checkSearch === 1) {
      usedUrl = `http://localhost:3000/search/${inputValue}`;
      lastPage = testLength;
    } else {
      usedUrl = "http://localhost:3000/get-all-data";
    }
    if (currentPage < lastPage - 1 || getIndex < lastPage - 1) {
      if (checkIndex === 1) {
        currentPage = getIndex + 1;
      } else {
        currentPage++;
      }
      console.log(currentPage);
      const loadingSpinner = document.getElementById("loadingSpinner");
      loadingSpinner.style.display = "block";
      setTimeout(() => {
        loadingSpinner.style.display = "none";
        nextButton.disabled = false;
        prevButton.disabled = false;

        pages.innerHTML = "";
        createNextPageNumber(lastPage, currentPage);
        showPageTest(document.querySelector("table"), currentPage, usedUrl);
        updateButtons();
        setActive();
        checkIndex = 0;
      }, 1000);
      nextButton.disabled = true;
      prevButton.disabled = true;
    }
  });

  updateButtons();
});
