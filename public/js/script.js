window.addEventListener("load", () => {

	const addIngredientBtn = document.querySelector('.add_ingredient')
	const ingredients = document.querySelector(".ingredients")
	const removeIngredientBtn = document.querySelectorAll('.remove_ingredient')

	//Create a new input whenever we click on "Add ingredient button"
	addIngredientBtn.addEventListener('click', () => {
		//Creating a new div
		const newDiv = document.createElement('div')
		newDiv.className = "oneIngredient"
		ingredients.appendChild(newDiv)

		//Creating an input in the new Div
		const newInput = document.createElement('input')
		newInput.className = "data-input"
		newInput.name = "ingredients"
		newDiv.appendChild(newInput)
		//also creating its own "remove ingredient" button, inside the div
		const newRemoveBtn = document.createElement('button')
		newRemoveBtn.className = "remove_ingredient button"
		newRemoveBtn.textContent = " - "
		newRemoveBtn.type="button"
		newDiv.appendChild(newRemoveBtn)
	})


});
