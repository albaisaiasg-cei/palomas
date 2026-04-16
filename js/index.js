//Se utiliza import para obtener los datos de un archivo local. Se especifica que el archivo es tipo json para que el compilador del navegador sepa el tipo de archivo y lo convierta en un objeto.
import pigeonsWithSummaries from '../assets/pigeon_data/pigeons-with-summaries.json' with {type: 'json'}

// Se declaran constantes para utilizarlas en funciones futuras, se declaran con un scope local en previsión a usarse en distintas secciones.
const stampsGrid = document.getElementById('stampsGrid')
const detail = document.getElementById('detail')
const postcardContainer = document.getElementById('postcardContainer')
const detailFactsheet = document.getElementById('detailFactsheet')
const detailPostcardFront = document.getElementById('detailPostcardFront')
const detailPostcardBack = document.getElementById('detailPostcardBack')

// Creación de estampilla de cada paloma
pigeonsWithSummaries.data.forEach(pigeon => {
    // Se crea el elemento picture que será el contenedor de la imagen (estampilla) de cada paloma
    let singleStamp = document.createElement('picture')

    // Se declara una constante que manipula datos del array para referencia sencilla más adelante
    const fileName = 'assets/pigeon_stamps/' + pigeon.commonName.split(' ').join('_') + '.png'
    // Se da clase y modifica el html interno de la singleStamp (picture) nueva
    singleStamp.classList.add('stamps__img-container')
    singleStamp.innerHTML = `
    <img 
    class="stamps__img" 
    src="${fileName}"
    loading="lazy"
    title="${pigeon.genus} ${pigeon.species}"
    alt="${pigeon.commonName} styled as a vintage postal stamp">
    `
    // Se agrega cada estampilla a su contenedor
    stampsGrid.appendChild(singleStamp)

    
/* Por ahora no funciona porque el documento ta incompleto
    //Se agrega un escucha de evento para que cuando se haga click en cada estampilla, aparezca la información detallada de la especie seleccionada
    singleStamp.addEventListener('click', (e) => {
        // Se declara una constante que será el enlace al artículo de Wikipedia de cada paloma
        detail.classList.toggle('active')
        const articleLink = 'https://en.wikipedia.org/wiki/' + pigeon.articleTitle.split(' ').join('_')

        // Revisar: poner ícono final
        detailFactsheet.innerHTML = `
        <h3>More about the ${pigeon.commonName}</h3>
        <p>${pigeon.summary}</p>
        <a title="Go to the ${pigeon.commonName} Wikipedia Article" href="${articleLink}" class="btn">
            Wiki article
            <span>icon-here</span>
        </a>
        `
    })
*/

const articleLink = pigeon.articleTitle ? 'https://en.wikipedia.org/wiki/' + pigeon.articleTitle.split(' ').join('_') : ''
singleStamp.addEventListener('click', (e) => {
    console.log(e)
    if (pigeon.genus) {
        // Revisar: poner ícono final
        detailFactsheet.innerHTML = `
        <h3 class:"detail__factsheet-title">More about the ${pigeon.commonName}</h3>
        <p class:"detail__factsheet-text">${pigeon.summary}</p>
        <a title="Go to the ${pigeon.commonName} Wikipedia Article" href="${articleLink}" class="btn detail__factsheet-external-link" target="_blank" rel="noopener noreferrer">
            Wiki article
            <span>icon-here</span>
        </a>
        `

        detailPostcardFront.innerHTML = `
            <picture class="detail__postcard-img-container">
                <img class="detail__postard-img" src="${pigeon.photos[0]}" alt="${pigeon.commonName}">
            </picture>
            <div class="detail__postcard-info">
                <h2>${pigeon.commonName}</h2>
                <p>${pigeon.genus} ${pigeon.species}</p>
            </div>
        `

        detailPostcardBack.innerHTML = `
            <picture class="detail__postcard-img-container">
                <img class="detail__postard-img" src="${fileName}" alt="${pigeon.commonName} styled as a vintage postal stamp">
            </picture>

            <div class="detail__postcard-metadata">
                <p class="detail__metadatum">Common Name: ${pigeon.commonName}</p>
                <p class="detail__metadatum">Genus: ${pigeon.genus}</p>
                <p class="detail__metadatum">Species: ${pigeon.species}</p>
                <p class="detail__metadatum">Living Region: ${pigeon.range.region}</p>
                <p class="detail__metadatum">Conservation Status: ${pigeon.conservationStatus}</p>
            </div>
        `
    } else {
        detailFactsheet.innerHTML = `
        <p class="text-xl">404 cucurrucucú not found</p>
        `
    }

    // Revisar: cómo hacer que el clipboard siempre salga en la parte de la pantalla que quiero
        detail.classList.toggle('active')
    })
})

// Interacciones con contenedor detalle
detail.addEventListener('click')


// Visualización de información detalle
function sendPostcardBack() {
    postcardContainer.classList.remove('top')
}

function sendFactsheetBack() {
    detailFactsheet.classList.remove('top')
}

postcardContainer.addEventListener('click', () => {
    if (postcardContainer.classList.contains('top')) {
        detailPostcardFront.classList.toggle('active')
        detailPostcardBack.classList.toggle('active')
        detailPostcardFront.classList.toggle('inactive')
        detailPostcardBack.classList.toggle('inactive')
    } else {
        postcardContainer.classList.add('top')
        sendFactsheetBack()
    }
}) 

detailFactsheet.addEventListener('click', () => {
    if (detailFactsheet.classList.contains('top')) {
        // Por ahora no hacer nadaP
    } else {
        detailFactsheet.classList.add('top')
        sendPostcardBack()
    }
})