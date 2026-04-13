//Se utiliza import para obtener los datos de un archivo local. Se especifica que el archivo es tipo json para que el compilador del navegador sepa el tipo de archivo y lo convierta en un objeto.
import pigeonsWithSummaries from '../assets/pigeon_data/pigeons-with-summaries.json' with {type: 'json'}

// Se declaran constantes para utilizarlas en funciones futuras, se declaran con un scope local en previsión a usarse en distintas secciones.
const stampsGrid = document.getElementById('stampsGrid')
const detail = document.getElementById('detail')
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
        <h3>More about the ${pigeon.commonName}</h3>
        <p>${pigeon.summary}</p>
        <a title="Go to the ${pigeon.commonName} Wikipedia Article" href="${articleLink}" class="btn" target="_blank" rel="noopener noreferrer">
            Wiki article
            <span>icon-here</span>
        </a>
        `
    } else {
        detailFactsheet.innerHTML = `
        <p class="text-xl">404 cucurrucucú not found</p>
        `
    }

    // Revisar: cómo hacer que el clipboard siempre salga en la parte de la pantalla que quiero
        detail.style.top = e.offsetY
        detail.classList.toggle('active')
    })
})