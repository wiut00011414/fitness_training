import { generatetrainings, generateCard, sort6recursively } from './trainingsContent.js';
import { PopUp } from './PopUp.js';

const contentWidth = window.innerWidth;
let cardsNumber = contentWidth >= 1280 ? 8 : contentWidth >= 768 ? 6 : 3;

let trainingsContent = document.querySelector('.trainings__content');


const burger = document.querySelector('.burger');
const navBar = document.querySelector('.navigation');
const logo = document.querySelector('.header__logo');

const showNavBar = () => {
	burger.classList.toggle('burger-active');
	navBar.classList.toggle('navigation-active');
	logo.classList.toggle('logo-move');
	document.querySelector('body').classList.toggle('overflow-y');

	document.addEventListener('click', (e) => {
		if (e.target.closest('.burger') === burger) return;
		else if (navBar.classList.contains('navigation-active') && !e.target.classList.contains('navigation'))
			showNavBar();
	});
	console.log(fulltrainingsList);
};

burger.addEventListener('click', showNavBar);



let trainings = []; 
let fulltrainingsList = []; 

fetch('../trainings.json').then((res) => res.json()).then((list) => {
	trainings = list;

	fulltrainingsList = (() => {
		let tempArr = [];
		for (let i = 0; i < 6; i++) {
			const newtrainings = trainings;
			for (let j = trainings.length; j > 0; j--) {
				let randInd = Math.floor(Math.random() * j);
				const randElem = newtrainings.splice(randInd, 1)[0];
				newtrainings.push(randElem);
			}
			tempArr = [ ...tempArr, ...newtrainings ];
		}
		return tempArr;
	})();

	fulltrainingsList = sort6recursively(fulltrainingsList);
	generatetrainings(fulltrainingsList, cardsNumber, trainings);
});


const paginationFirstPage = document.querySelector('.pagination_first-page'),
	paginationPreviousPage = document.querySelector('.pagination_previous-page'),
	paginationPageNumber = document.querySelector('.pagination_page-number'),
	paginationNextPage = document.querySelector('.pagination_next-page'),
	paginationLastPage = document.querySelector('.pagination_last-page');

if (paginationPageNumber !== null) {
	const paginationButtons = () => {
		if (paginationPageNumber.textContent === '1') {
			paginationLastPage.classList.remove('pagination_inactive');
			paginationNextPage.classList.remove('pagination_inactive');
			paginationFirstPage.classList.add('pagination_inactive');
			paginationPreviousPage.classList.add('pagination_inactive');
		} else if (paginationPageNumber.textContent === `${48 / cardsNumber}`) {
			paginationLastPage.classList.add('pagination_inactive');
			paginationNextPage.classList.add('pagination_inactive');
			paginationFirstPage.classList.remove('pagination_inactive');
			paginationPreviousPage.classList.remove('pagination_inactive');
		} else {
			paginationLastPage.classList.remove('pagination_inactive');
			paginationNextPage.classList.remove('pagination_inactive');
			paginationFirstPage.classList.remove('pagination_inactive');
			paginationPreviousPage.classList.remove('pagination_inactive');
		}
		console.log(trainings);
	};

	paginationFirstPage.addEventListener('click', (e) => {
		if (paginationFirstPage.classList.contains('pagination_inactive')) return;

		paginationPageNumber.textContent = '1';

		generatetrainings(fulltrainingsList, cardsNumber, trainings);
		paginationButtons();
	});

	paginationPreviousPage.addEventListener('click', (e) => {
		if (paginationPreviousPage.classList.contains('pagination_inactive')) return;

		paginationPageNumber.textContent = `${+paginationPageNumber.textContent - 1}`;
		generatetrainings(fulltrainingsList, cardsNumber, trainings, +paginationPageNumber.textContent);
		paginationButtons();
	});

	paginationNextPage.addEventListener('click', (e) => {
		if (paginationNextPage.classList.contains('pagination_inactive')) return;

		paginationPageNumber.textContent = `${+paginationPageNumber.textContent + 1}`;
		generatetrainings(fulltrainingsList, cardsNumber, trainings, +paginationPageNumber.textContent);
		paginationButtons();
	});

	paginationLastPage.addEventListener('click', (e) => {
		if (paginationLastPage.classList.contains('pagination_inactive')) return;

		paginationPageNumber.textContent = `${48 / cardsNumber}`;
		generatetrainings(fulltrainingsList, cardsNumber, trainings, 48 / cardsNumber);
		paginationButtons();
	});
}


const generatePopUp = (e) => {
	const training = e.target.closest('.training');

	if (training) {
		let popUp = new PopUp(trainings[+training.getAttribute('data-index')]);
		popUp.buildPopUp();
	}
}
trainingsContent.addEventListener('click', generatePopUp);


const nextBtn = document.querySelector('.trainings__right'),
	prevBtn = document.querySelector('.trainings__left');
let slideNum = 0;
if (nextBtn !== null) {
	cardsNumber = Math.round(cardsNumber / 3);
	nextBtn.addEventListener('click', (e) => {
		trainingsContent = document.querySelector('.trainings__content');
		slideNum = slideNum === fulltrainingsList.length / cardsNumber ? 1 : slideNum + 1;
		slideNum %= fulltrainingsList.length / cardsNumber;
		const newtrainingsContent = document.createElement('div');
		newtrainingsContent.classList.add('trainings__content');
		newtrainingsContent.setAttribute('data-page', 'main');

		for (let i = 0; i < cardsNumber; i++) {
			newtrainingsContent.append(generateCard(fulltrainingsList[slideNum * cardsNumber + i], trainings));
		}

		newtrainingsContent.style.transform = `translateX(${trainingsContent.offsetWidth}px)`;
		document.querySelector('.trainings__container').append(newtrainingsContent);
		trainingsContent.style.transform = `translateX(-${trainingsContent.offsetWidth}px)`;
		newtrainingsContent.style.transform = `translateX(0px)`;
		setTimeout(() => document.querySelector('.trainings__content').remove(), 1000);

		newtrainingsContent.addEventListener('click', generatePopUp);
	});

	prevBtn.addEventListener('click', (e) => {
		trainingsContent = document.querySelector('.trainings__content');
		slideNum = slideNum === 0 ? fulltrainingsList.length / cardsNumber - 1 : slideNum - 1;
		slideNum %= fulltrainingsList.length / cardsNumber;
		const newtrainingsContent = document.createElement('div');
		newtrainingsContent.classList.add('trainings__content');
		newtrainingsContent.setAttribute('data-page', 'main');

		for (let i = 0; i < cardsNumber; i++) {
			newtrainingsContent.append(generateCard(fulltrainingsList[slideNum * cardsNumber + i], trainings));
		}

		newtrainingsContent.style.transform = `translateX(-${trainingsContent.offsetWidth}px)`;
		document.querySelector('.trainings__container').prepend(newtrainingsContent);
		trainingsContent.style.transform = `translateX(${trainingsContent.offsetWidth}px)`;
		newtrainingsContent.style.transform = `translateX(0px)`;
		setTimeout(() => document.querySelectorAll('.trainings__content')[1].remove(), 1000);
		newtrainingsContent.addEventListener('click', generatePopUp);
	});
}
