$(function () {
    loadRecipes();

    $("#recipes").on("click", ".delete-btn", function () {
        var id = $(this).closest(".recipe").attr("data-id");
        if (confirm("Are you sure you want to delete this recipe?")) {
            handleDelete(id);
        }
    });

    $("#recipes").on("click", ".edit-btn", function () {
        var parentDiv = $(this).closest(".recipe");
        parentDiv.find(".edit-area").show();
        parentDiv.find(".display-area").hide();
    });

    $("#recipes").on("click", ".cancel-edit", function () {
        var parentDiv = $(this).closest(".recipe");
        parentDiv.find(".edit-area").hide();
        parentDiv.find(".display-area").show();
    });

    $("#recipes").on("click", ".save-edit", function () {
        var parentDiv = $(this).closest(".recipe");
        var id = parentDiv.attr("data-id");
        var title = parentDiv.find(".edit-title").val();
        var body = parentDiv.find(".edit-body").val();
        updateRecipe(id, title, body);
    });

    $("#addBtn").click(addRecipe);
});

function loadRecipes() {
    fetch("https://usman-fake-api.herokuapp.com/api/recipes")
        .then(response => response.json())
        .then(data => {
            var recipes = $("#recipes");
            recipes.empty();
            data.forEach(rec => {
                recipes.append(createRecipeHtml(rec));
            });
        })
        .catch(() => {
            $("#recipes").html("<p class='text-red-500'>An Error has occurred</p>");
        });
}

function addRecipe() {
    var title = $("#title").val();
    var body = $("#body").val();
    fetch("https://usman-fake-api.herokuapp.com/api/recipes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body })
    })
        .then(response => response.json())
        .then(() => {
            $("#title").val("");
            $("#body").val("");
            loadRecipes();
            closeModal('addModal');
        })
        .catch(() => alert("Error adding recipe."));
}

function updateRecipe(id, title, body) {
    fetch(`https://usman-fake-api.herokuapp.com/api/recipes/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body })
    })
        .then(() => {
            loadRecipes();
            alert("Recipe updated successfully!");
        })
        .catch(() => alert("Error updating recipe."));
}

function handleDelete(id) {
    fetch(`https://usman-fake-api.herokuapp.com/api/recipes/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            loadRecipes();
            alert("Recipe deleted successfully!");
        })
        .catch(() => alert("Error deleting recipe."));
}

// Modal handling functions remain the same

function createRecipeHtml(rec) {
    return `<div class="recipe bg-white p-4 border border-gray-200 rounded shadow" data-id="${rec._id}">
              <div class="display-area">
                  <h3 class="text-lg text-gray-800"><b>Title:</b> ${rec.title}</h3>
                  <p class="mt-2 text-gray-600"><b>Description:</b> ${rec.body}</p>
                  <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3">Delete</button>
                  <button class="edit-btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-3">Edit</button>
              </div>
              <div class="edit-area hidden">
                  <input type="text" class="edit-title mt-2 p-2 border border-gray-300 rounded w-full" value="${rec.title}" />
                  <textarea class="edit-body mt-2 p-2 border border-gray-300 rounded w-full">${rec.body}</textarea>
                  <button class="save-edit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3">Save</button>
                  <button class="cancel-edit bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-3">Cancel</button>
              </div>
            </div>`;
}
function openModal(modalId) {
    $('#' + modalId).removeClass('hidden');
}

function closeModal(modalId) {
    $('#' + modalId).addClass('hidden');
}