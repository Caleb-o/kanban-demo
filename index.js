function main() {
    // Get the modal
    const modal = document.querySelector('#modal');
    const modalHeader = document.querySelector('#modal-header');

    // Get the button that opens the modal
    const btn = document.querySelector('#to-remove-btn');

    // Get the <span> element that closes the modal
    const span = document.querySelector('#close');

    const createdOn = document.querySelector('#created-on');

    const colorSelected = document.querySelector('#color-selected');

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        const date = new Date();
        modal.style.display = 'block';
        createdOn.innerText = `Created on ${date.toDateString()}`;
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = 'none';
    };

    colorSelected.onchange = function () {
        let color =
            colorSelected.options[colorSelected.selectedIndex].style
                .backgroundColor;

        colorSelected.style.backgroundColor = color;
        modalHeader.style.backgroundColor = color;
    };
}

window.addEventListener('load', main);
