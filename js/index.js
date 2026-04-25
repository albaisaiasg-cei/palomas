// Revisar que cuando se haga clic en una relatedSpecies la postcard solo se voltee si está en modo postcardBack

/* ==================== DATA & DOM REFERENCES ==================== */

// Se utiliza import para obtener los datos de un archivo local. Se especifica que el archivo es tipo json para que el compilador del navegador sepa el tipo de archivo y lo convierta en un objeto.
import pigeonsWithSummaries from '../assets/pigeon_data/pigeons-with-summaries.json' with { type: 'json' }

// Se declaran constantes para utilizarlas en funciones futuras, se declaran con un scope local en previsión a usarse en distintas secciones.
const stampsGrid = document.getElementById('stampsGrid')
const detail = document.getElementById('detail')
const postcardContainer = document.getElementById('postcardContainer')
const detailFactsheet = document.getElementById('detailFactsheet')
const detailPostcardFront = document.getElementById('detailPostcardFront')
const detailPostcardBack = document.getElementById('detailPostcardBack')
const detailRelatedSpecies = document.getElementById('detailRelatedSpecies')
const detailMapCanvas = document.getElementById('detailMapCanvas')
const detailMapRegions = document.getElementById('detailMapRegions')
const detailMapLocations = document.getElementById('detailMapLocations')
const stamps = document.getElementById('stamps')

var mapsToClean = []

// Z-index values for clipboard element stacking
const Z_INDEX_CONTENT = '2'
const Z_INDEX_TOP_DETAIL = '3'

/* /DATA & DOM REFERENCES /*/

/* ==================== UTILITY FUNCTIONS ==================== */

// Random number
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}

// Obtener ruta de estampilla para manipular datos del array para referencia sencilla más adelante
function getStampFilePath(pigeonName, extension = 'png') {
    const fileName =
        `assets/pigeon_stamps/${extension}/` + pigeonName.split(' ').join('_') + `.${extension}`
    return fileName
}

// Escribir nombre de región
function translateRegionName(region) {
    switch (region) {
        case 'NA':
            return 'North America'
        case 'MA':
            return 'Middle America'
        case 'SA':
            return 'South America'
        case 'AF':
            return 'Africa'
        case 'OR':
            return 'Oriental Region'
        case 'EU':
            return 'Eurasia'
        case 'IO':
            return 'Indian Ocean'
        case 'AU':
            return 'Australasia'
        case 'PO':
            return 'Polynesia'
    }
}

// Escribir nombre de conservation status 
function translateConservationStatus(status) {
    switch (status) {
        case 'LC':
            return 'Least Concern'
        case 'NT':
            return 'Near Threatened'
        case 'VU':
            return 'Vulnerable'
        case 'EN':
            return 'Endangered'
        case 'CR':
            return 'Critically Endangered'
        case 'EW':
            return 'Extinct in the Wild'
        case 'EX':
            return 'Extinct'
    }
}

/* /UTILITY FUNCTIONS /*/

/* ==================== DOM GENERATION FUNCTIONS ==================== */

function createButtonStamp(pigeon, pictureClass, imgClass) {
    // let singleStamp = document.createElement('picture')
    // singleStamp.tabIndex = 0

    let singleStamp = document.createElement('button')
    singleStamp.type = 'button'
    singleStamp.classList.add('detail__open-button')
    singleStamp.ariaLabel = `Open detail view for ${pigeon.commonName}`
    // Revisar: Para mejoras de performance futuras: singleStamp.dataset.id = `stamp-${pigeon.commonName.split(' ').join('-')}`
    // Se declara una constante que manipula datos del array para referencia sencilla más adelante
    // const fileName = 'assets/pigeon_stamps/' + pigeon.commonName.split(' ').join('_') + '.png'
    // Se da clase y modifica el html interno de la singleStamp (picture) nueva
    // singleStamp.classList.add(pictureClass)

    singleStamp.innerHTML = `
        <picture class="${pictureClass}">
            <source srcset="${getStampFilePath(pigeon.commonName, 'webp')}" type="image/webp">
            <img 
                class="${imgClass}" 
                src="${getStampFilePath(pigeon.commonName)}"
                loading="lazy"
                title="${pigeon.genus} ${pigeon.species}"
                alt="${pigeon.commonName} styled as a vintage postal stamp"
            >
        </picture>
    `
    return singleStamp
}

function createPictureStamp(pigeon, pictureClass, imgClass) {
    let singleStamp = document.createElement('picture')
    singleStamp.tabIndex = 0

    // Se declara una constante que manipula datos del array para referencia sencilla más adelante
    // const fileName = 'assets/pigeon_stamps/' + pigeon.commonName.split(' ').join('_') + '.png'
    // Se da clase y modifica el html interno de la singleStamp (picture) nueva
    singleStamp.classList.add(pictureClass)
    // Revisar: Cambiar formato de src a webp cuando tenga las imágenes
    singleStamp.innerHTML = `
    <source srcset="${getStampFilePath(pigeon.commonName, 'webp')}" type="image/webp">
    <img 
        class="${imgClass}" 
        src="${getStampFilePath(pigeon.commonName)}"
        loading="lazy"
        title="${pigeon.genus} ${pigeon.species}"
        alt="${pigeon.commonName} styled as a vintage postal stamp"
    >
    `
    return singleStamp
}

function generateMainInfo(pigeon) {
    /* Main info element */
    const detailMainInfo = document.getElementById('detailMainInfo')
    const articleLink = pigeon.articleTitle
        ? 'https://en.wikipedia.org/wiki/' + pigeon.articleTitle.split(' ').join('_')
        : ''

    detailMainInfo.innerHTML = `
    <h3 class="detail__title">More about the ${pigeon.commonName}</h3>
    <p class="detail__summary">${pigeon.summary}</p>
    <a class="link detail__wiki-link" title="Go to the ${pigeon.commonName} Wikipedia Article" target="blank" rel="noopener noreferrer" href="${articleLink}">
        Wiki article
    </a>
    `
    /* /Main info element */
}

function generateMapElement(pigeon) {
    /* Map element */
    pigeon.range.regions.forEach((region) => {
        let singleRegion = document.createElement('picture')
        singleRegion.classList.add('detail__map-picture')
        singleRegion.innerHTML = `
        <source src="assets/maps/${region}.svg" type="image/svg">
        <img class="detail__map-img" src="assets/maps/${region}.svg" alt="${translateRegionName(region)}">
        `
        detailMapCanvas.appendChild(singleRegion)
        mapsToClean.push(singleRegion)
    })

    const regions = pigeon.range.regions.map((region) => translateRegionName(region)).join(', ')

    detailMapRegions.innerText = `
    living region: ${regions}
    `
    detailMapLocations.innerText = `
    locations: ${pigeon.range.locations.join(', ')}
    `
    /* /Map element */

    return regions
}

function generateRelatedSpeciesElement(pigeon) {
    /* Related species element */
    pigeon.range.regions.forEach((region) => {
        // Filter by region
        const relatedSpecies = pigeonsWithSummaries.data.filter(p => p.range.regions.includes(region) && p.commonName !== pigeon.commonName)

        // Select 5 random related species
        const max = getRandomNumber(5, relatedSpecies.length)
        const min = max - 5
        const selectedSpecies = relatedSpecies.slice(min, max)
        console.log(selectedSpecies)

        // Create container for selected species
        let singleRegion = document.createElement('div')
        singleRegion.classList.add('detail__related-region')

        // Create stamp of each selected species with click listeners
        selectedSpecies.forEach((species) => {
            const selectedPigeonStamp = createButtonStamp(species, 'detail__related-picture', 'detail__related-img')
            singleRegion.appendChild(selectedPigeonStamp)

            // Add click event listener to load related species details
            selectedPigeonStamp.addEventListener('click', (e) => {
                e.stopPropagation()
                // Revisar: cómo hacer que haga scroll hasta arriba
                // detail.scrollTop = 0 .scrollTo({ top: 0, behavior: 'smooth'})
                closeDetail()
                generateDetail(species)
                openDetail(species)
                flipPostcard()
                detail.scrollTop = 0
            })
        })

        // Create container for related species text
        let singleRegionText = document.createElement('p')
        singleRegionText.classList.add('detail__region-name')
        singleRegionText.classList.add('text-md')
        singleRegionText.innerText = `
        Other species in ${translateRegionName(region)}
        `

        // Append elements to related species container
        detailRelatedSpecies.appendChild(singleRegionText)
        detailRelatedSpecies.appendChild(singleRegion)
    })
    /* /Related species element */
}

function generatePostcardFront(pigeon) {
    /* Postcard front element */
    let extensionType = pigeon.photos[0].split('.').pop()
    console.log(extensionType)

    detailPostcardFront.innerHTML = `
    <picture class="detail__postcard-picture">
        <source src="${pigeon.photos[0]}" type="image/${extensionType}">
        <img 
        class="detail__postcard-img"
        src="${pigeon.photos[0]}"
        alt="${pigeon.genus} ${pigeon.species}"
        >
    </picture>
    <div class="detail__postcard-titles">
        <h2 class="detail__common-name">${pigeon.commonName}</h2>
        <p class="detail__scientific-name text-sm">${pigeon.genus} ${pigeon.species}</p>
    </div>
    `
    /* /Postcard front element */
}

function generatePostcardBack(pigeon, regions) {
    /* Postcard back element */
    const articleLink = pigeon.articleTitle
        ? 'https://en.wikipedia.org/wiki/' + pigeon.articleTitle.split(' ').join('_')
        : ''

    const postcardStamp = createPictureStamp(pigeon, 'detail__postcard-stamp-picture', 'detail__postcard-stamp-img')

    const postcardInfo = document.createElement('div')
    postcardInfo.classList.add('detail__postcard-info')
    postcardInfo.innerHTML = `
    <div class="detail__metadata">
        <p class="detail__metadatum text-md">Common Name: ${pigeon.commonName}</p>
        <p class="detail__metadatum text-md">Genus: ${pigeon.genus}</p>
        <p class="detail__metadatum text-md">Species: ${pigeon.species}</p>
        <p class="detail__metadatum text-md">Living Region: ${regions}</p>
        <p class="detail__metadatum text-md">ConservationStatus: ${translateConservationStatus(pigeon.conservationStatus)}</p>
    </div>
    
    <a class="link detail__wiki-link" title="Go to the ${pigeon.commonName} Wikipedia Article" target="blank" rel="noopener noreferrer" href="${articleLink}">
    Wiki article
    </a>
    `

    detailPostcardBack.appendChild(postcardStamp)
    detailPostcardBack.appendChild(postcardInfo)
    /* /Postcard back element */
}

function generateErrorDetail(pigeon) {
    /* Error element */
    detailFactsheet.innerHTML = `
    <p class="text-xl">404 cucurrucucú not found</p>
    <img 
        src="assets/postal-placeholder.png"
        alt="${pigeon.genus} ${pigeon.species}"
    >
    `
    /* /Error element */
}

function generateDetail(pigeon) {
    /* Detail section */
    if (pigeon.genus) {
        generateMainInfo(pigeon)
        const regions = generateMapElement(pigeon)
        generateRelatedSpeciesElement(pigeon)
        generatePostcardFront(pigeon)
        generatePostcardBack(pigeon, regions)
    } else {
        generateErrorDetail(pigeon)
    }

    /* /Detail section */
}

/* /DOM GENERATION FUNCTIONS /*/

/* ==================== DETAIL VIEW INTERACTIONS ==================== */

function closeDetail() {
    detail.classList.remove('active')
    
    while(detailPostcardBack.firstElementChild) {
        detailPostcardBack.removeChild(detailPostcardBack.firstElementChild)
    }
    
    while(detailRelatedSpecies.firstElementChild) {
        detailRelatedSpecies.removeChild(detailRelatedSpecies.firstElementChild)
    }
    
    mapsToClean.forEach((map) => {
        console.log(map)
        detailMapCanvas.removeChild(map)
    })
    
    mapsToClean = []
}

function openDetail(pigeon) {
    detail.classList.add('active')

    // Initialize z-index for both elements
    postcardContainer.style.zIndex = Z_INDEX_TOP_DETAIL
    detailFactsheet.style.zIndex = Z_INDEX_CONTENT

    // Animate
    move(postcardContainer)
    move(detailFactsheet)
}

/* /DETAIL VIEW INTERACTIONS /*/

/* ==================== ANIMATION FUNCTIONS ==================== */

// Generic animation helper
function animateElement(element, keyframes, options = {}) {
    const defaultOptions = {
        duration: 600,
        easing: 'ease-in-out',
        iterations: 1,
        fill: 'forwards'
    }
    element.animate(keyframes, { ...defaultOptions, ...options })
}

// Animate clipboard blocks entry
function move(element) {
    element.classList.remove('moving')
    element.classList.add('moving')
}

// Flip animation
function flip(element, direction = 'left') {
    const elementWidth = element.offsetWidth

    const flipDeg = direction === 'left' ? '-180deg' : '180deg'
    const flipKeyframes = [
        { transform: `rotateY(0deg)` },
        { transform: `rotateY(${flipDeg})` },
        { opacity: 0 },
        { opacity: 1 }
    ]
    animateElement(element, flipKeyframes, {
        duration: 1600,
        easing: 'cubic-bezier(0.85, 0, 0.15, 1)',
        fill: 'backwards'
    })
}

// Shuffle detail with animation
function shuffleDetail(element, inactiveElement, direction) {
    const elementWidth = element.offsetWidth

    const position = direction === 'left' ? `-${elementWidth}px` : `${elementWidth}px`
    const shuffleKeyframes = [
        { transform: 'translateX(0)' },
        { transform: `translateX(${position})` },
        { transform: 'translateX(0)' }
    ]
    animateElement(element, shuffleKeyframes, { duration: 1000 })

    setTimeout(() => {
        inactiveElement.style.zIndex = Z_INDEX_CONTENT
        element.style.zIndex = Z_INDEX_TOP_DETAIL
    }, 500)
}

/* /ANIMATION FUNCTIONS /*/

/* ==================== POSTCARD & FACTSHEET INTERACTIONS ==================== */

// Toggle postcard sides (front/back flip)
function flipToFront() {
    detailPostcardBack.classList.toggle('inactive')
    detailPostcardFront.classList.toggle('inactive')
    detailPostcardFront.classList.add('active')
}

function flipToBack() {
    detailPostcardFront.classList.toggle('inactive')
    detailPostcardBack.classList.toggle('inactive')
    detailPostcardBack.classList.add('active')
}

function flipPostcard() {
    console.log('Estoy flipando tìo')
    if (detailPostcardFront.classList.contains('active')) {
        flip(postcardContainer, 'left')
        // Delay class changes until animation completes (600ms)
        setTimeout(() => flipToBack(), 800)
    } else {
        flip(postcardContainer, 'right')
        // Delay class changes until animation completes (600ms)
        setTimeout(() => flipToFront(), 800)
    }
}

// Handle postcard container click interactions
postcardContainer.addEventListener('click', () => {
    if (postcardContainer.style.zIndex === Z_INDEX_TOP_DETAIL) {
        // If postcard is already on top, flip it
        flipPostcard()
    } else {
        // Otherwise bring postcard to front and swap with factsheet
        //swapClipboardElements(postcardContainer, detailFactsheet, 'left')
        shuffleDetail(postcardContainer, detailFactsheet, 'left')
    }
})

// Handle factsheet click interactions
detailFactsheet.addEventListener('click', () => {
    if (detailFactsheet.style.zIndex === Z_INDEX_TOP_DETAIL) {
        // Factsheet is already on top - no action for now
    } else {
        // Bring factsheet to front and swap with postcard
        //swapClipboardElements(detailFactsheet, postcardContainer, 'right')
        shuffleDetail(detailFactsheet, postcardContainer, 'right')
    }
})

/* /POSTCARD & FACTSHEET INTERACTIONS /*/

/* ==================== DRAG SCROLL FUNCTIONALITY ==================== */

// Draggable canvas implementation
// References: https://discourse.wicg.io/t/drag-to-scroll-a-simple-way-to-scroll-sideways-on-desktop/3627/
// https://www.youtube.com/watch?v=C9EWifQ5xqA
// https://stackoverflow.com/questions/22504437/should-cursor-property-be-defined-in-class-or-classhover

let isDown = false
let startX
let startY
let scrollLeft
let scrollTop
let pendingScroll = false

stamps.addEventListener('mousedown', (e) => {
    isDown = true
    stamps.classList.add('dragging')
    startX = e.pageX - stamps.offsetLeft
    startY = e.pageY - stamps.offsetTop
    scrollLeft = stamps.scrollLeft
    scrollTop = stamps.scrollTop
    pendingScroll = false
})

stamps.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    
    const scrollX = scrollLeft - (e.pageX - stamps.offsetLeft - startX)
    const scrollY = scrollTop - (e.pageY - stamps.offsetTop - startY)

    if (!pendingScroll) {
        pendingScroll = true
        requestAnimationFrame(() => {
            stamps.scroll(scrollX, scrollY)
            pendingScroll = false
        })
    }
})

stamps.addEventListener('mouseup', () => {
    isDown = false
    stamps.classList.remove('dragging')
})

stamps.addEventListener('mouseleave', () => {
    isDown = false
    stamps.classList.remove('dragging')
})

// Center the stamps grid on page load
function centerStampsGrid() {
    if (!stamps || !stampsGrid) return

    const centerX = (stampsGrid.scrollWidth - stamps.clientWidth) / 2
    const centerY = (stampsGrid.scrollHeight - stamps.clientHeight) / 2

    console.log(centerX)

    stamps.scroll(centerX, centerY)
}

/* /DRAG SCROLL FUNCTIONALITY /*/

/* ==================== INITIALIZATION ==================== */

// Setup detail overlay close button
const detailCloseButton = document.getElementById('detailCloseButton')
detailCloseButton.addEventListener('click', () => closeDetail())

// Setup detail overlay click handler
const detailOverlay = document.getElementById('detailOverlay')
detailOverlay.addEventListener('click', (e) => closeDetail())

// Initialize stamps grid with click handlers
pigeonsWithSummaries.data.forEach((pigeon) => {
    const singleStamp = createButtonStamp(pigeon, 'stamps__picture', 'stamps__img')
    stampsGrid.appendChild(singleStamp)

    singleStamp.addEventListener('click', (e) => {
        generateDetail(pigeon)
        openDetail(pigeon)
    })
})

// Center stamps grid and setup listeners on page load
window.addEventListener('load', () => {
    requestAnimationFrame(() => setTimeout(centerStampsGrid, 5))
})

/* /INITIALIZATION /*/