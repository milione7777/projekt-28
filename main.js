document.addEventListener("DOMContentLoaded", function () {
  // Отримання елементів DOM
  const studentForm = document.getElementById("studentForm");
  const studentsTable = document
    .getElementById("studentsTable")
    .getElementsByTagName("tbody")[0];
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const editForm = document.getElementById("editForm");
  const exportDataButton = document.getElementById("exportData");
  const importDataButton = document.getElementById("importData");

  let studentsData = []; // Масив для зберігання студентів

  // Додавання нового студента
  studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newStudent = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      age: document.getElementById("age").value,
      course: document.getElementById("course").value,
      faculty: document.getElementById("faculty").value,
      subjects: document
        .getElementById("subjects")
        .value.split(",")
        .map((item) => item.trim()),
    };
    studentsData.push(newStudent);
    saveStudents();
    renderStudents();
    studentForm.reset();
  });

  // Збереження даних у локальний файл (імітація)
  function saveStudents() {
    localStorage.setItem("students", JSON.stringify(studentsData));
  }

  // Завантаження даних
  function loadStudents() {
    const data = localStorage.getItem("students");
    if (data) {
      studentsData = JSON.parse(data);
      renderStudents();
    }
  }

  // Відображення студентів в таблиці
  function renderStudents() {
    studentsTable.innerHTML = "";
    studentsData.forEach((student, index) => {
      const row = studentsTable.insertRow();
      row.innerHTML = `
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.age}</td>
                <td>${student.course}</td>
                <td>${student.faculty}</td>
                <td>${student.subjects.join(", ")}</td>
                <td>
                    <button class="edit" data-index="${index}">Редагувати</button>
                    <button class="delete" data-index="${index}">Видалити</button>
                </td>
            `;
    });
    addEventListenersForActions();
  }

  // Додавання обробників подій для редагування та видалення
  function addEventListenersForActions() {
    const editButtons = document.querySelectorAll(".edit");
    const deleteButtons = document.querySelectorAll(".delete");

    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = button.dataset.index;
        openEditModal(studentsData[index], index);
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = button.dataset.index;
        studentsData.splice(index, 1);
        saveStudents();
        renderStudents();
      });
    });
  }

  // Відкриття модального вікна для редагування
  function openEditModal(student, index) {
    document.getElementById("editFirstName").value = student.firstName;
    document.getElementById("editLastName").value = student.lastName;
    document.getElementById("editAge").value = student.age;
    document.getElementById("editCourse").value = student.course;
    document.getElementById("editFaculty").value = student.faculty;
    document.getElementById("editSubjects").value = student.subjects.join(", ");
    editForm.onsubmit = function (e) {
      e.preventDefault();
      studentsData[index] = {
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        age: document.getElementById("editAge").value,
        course: document.getElementById("editCourse").value,
        faculty: document.getElementById("editFaculty").value,
        subjects: document
          .getElementById("editSubjects")
          .value.split(",")
          .map((item) => item.trim()),
      };
      saveStudents();
      renderStudents();
      closeEditModal();
    };
    editModal.style.display = "block";
  }

  // Закриття модального вікна
  function closeEditModal() {
    editModal.style.display = "none";
  }

  closeModal.addEventListener("click", closeEditModal);

  // Експорт даних в JSON
  exportDataButton.addEventListener("click", function () {
    const json = JSON.stringify(studentsData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.json";
    a.click();
  });

  // Імпорт даних з JSON
  importDataButton.addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        const data = JSON.parse(event.target.result);
        studentsData = data;
        saveStudents();
        renderStudents();
      };
      reader.readAsText(file);
    };
    input.click();
  });

  // Завантаження даних при завантаженні сторінки
  loadStudents();
});
