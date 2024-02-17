let dragSrcEl = null;

document.addEventListener("DOMContentLoaded", function () {
  const displayArea = document.querySelector(".display");

  document.getElementById("addInput").addEventListener("click", function () {
    addComponent("input");
  });
  document.getElementById("addSelect").addEventListener("click", function () {
    addComponent("select");
  });
  document.getElementById("addTextarea").addEventListener("click", function () {
    addComponent("textarea");
  });

  document.getElementById("saveForm").addEventListener("click", saveForm);

  function addComponent(type) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("draggable", true);
    wrapper.classList.add("draggable");
    let innerHTML = `<div class="box"> <label>${type}</label></div>`;

    if (type === "select") {
      innerHTML += `<select class="item"><option value="option1">sample option1</option>
                        <option value="option2">sample option2</option>
                        <option value="option3">sample option3</option></select>`;
    } else {
      innerHTML += `<${type} class="item" placeholder="sample placeholder"></${type}>`;
    }

    wrapper.innerHTML = innerHTML;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      wrapper.remove();
    };
    wrapper.querySelector(".box").appendChild(deleteBtn);

    displayArea.appendChild(wrapper);

    wrapper.addEventListener("dragstart", handleDragStart);
    wrapper.addEventListener("dragover", handleDragOver);
    wrapper.addEventListener("drop", handleDrop);
  }

  function handleDragStart(e) {
    console.log("dragStart");
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.outerHTML);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dragSrcElParent = dragSrcEl.parentNode;
    const dropTarget = e.target.closest(".draggable");
    if (!dropTarget || dragSrcEl === dropTarget) {
      return;
    }

    const allDraggables = Array.from(
      document.querySelectorAll(".display .draggable")
    );
    const dragIndex = allDraggables.indexOf(dragSrcEl);
    const dropIndex = allDraggables.indexOf(dropTarget);

    if (dragIndex < dropIndex) {
      dragSrcElParent.insertBefore(dragSrcEl, dropTarget.nextSibling);
    } else {
      dragSrcElParent.insertBefore(dragSrcEl, dropTarget);
    }
  }

  function saveForm() {
    const components = document.querySelectorAll(".display > .draggable");
    const formDesign = Array.from(components).map((comp, index) => {
      const type = comp.querySelector("label").textContent.toLowerCase();
      let details = {
        id: generateUUID(),
        type: type,
        label: "Sample Label",
      };

      if (type === "input" || type === "textarea") {
        const element = comp.querySelector(".item");
        details = {
          ...details,
          placeholder: element.placeholder,
        };
      } else if (type === "select") {
        const options = comp.querySelector("select").options;
        details = {
          ...details,
          options: Array.from(options).map((option) => option.text),
        };
      }
      return details;
    });

    console.log(formDesign);
    alert(JSON.stringify(formDesign, null, 2));
  }

  function generateUUID() {
    return "xxxx-xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
});
