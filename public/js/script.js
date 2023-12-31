window.addEventListener("load", () => {

	const addIngredientBtn = document.querySelector('.add_ingredient')
	const ingredients = document.querySelector(".ingredients")
	let removeIngredientBtn = document.querySelectorAll('.remove_ingredient')

	//Create a new input whenever we click on "Add ingredient button"
	addIngredientBtn.addEventListener('click', () => {

		//Creating an input in the new Div
		const newInput = document.createElement('input')
		newInput.className = "data-input"
		newInput.name = "ingredients"
		ingredients.appendChild(newInput)
		//also creating its own "remove ingredient" button, inside the div
		const newRemoveBtn = document.createElement('button')
		
		newRemoveBtn.className = "remove_ingredient button"
		newRemoveBtn.textContent = " X "
		newRemoveBtn.type="button"
		ingredients.appendChild(newRemoveBtn)
		const newBr = document.createElement('br')
		ingredients.appendChild(newBr)
		
		newRemoveBtn.addEventListener('click', (event)=>{
			const inputToRemove = event.target.previousElementSibling;
			inputToRemove.remove()
			newBr.remove()
			newRemoveBtn.remove()
		})
	})

	removeIngredientBtn.forEach(button=>{
		button.addEventListener('click', (event)=>{
			const inputToRemove = event.target.previousElementSibling;
			const brToRemove = event.target.nextElementSibling;
			brToRemove.remove()
			inputToRemove.remove()
			button.remove()
		})
	})
});
