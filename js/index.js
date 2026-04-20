// Se utiliza import para obtener los datos de un archivo local. Se especifica que el archivo es tipo json para que el compilador del navegador sepa el tipo de archivo y lo convierta en un objeto.
import pigeonsWithSummaries from "../assets/pigeon_data/pigeons-with-summaries.json" with { type: "json" };

// Se declaran constantes para utilizarlas en funciones futuras, se declaran con un scope local en previsión a usarse en distintas secciones.
const stampsGrid = document.getElementById("stampsGrid");
const detail = document.getElementById("detail");
const postcardContainer = document.getElementById("postcardContainer");
const detailFactsheet = document.getElementById("detailFactsheet");
const detailPostcardFront = document.getElementById("detailPostcardFront");
const detailPostcardBack = document.getElementById("detailPostcardBack");


function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Obtener ruta de estampilla para manipular datos del array para referencia sencilla más adelante
function getStampFilePath(pigeonName, extension = "png") {
    const fileName =
        "assets/pigeon_stamps/" + pigeonName.split(" ").join("_") + `.${extension}`;
    return fileName;
}

// Escribir nombre de región
function translateRegionName(region) {
    switch(region) {
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
    switch(status) {
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

function createStamp(pigeon, pictureClass, imgClass) {
    let singleStamp = document.createElement("picture");
    singleStamp.tabIndex = 0;
    
    // Se declara una constante que manipula datos del array para referencia sencilla más adelante
    // const fileName = 'assets/pigeon_stamps/' + pigeon.commonName.split(' ').join('_') + '.png'
    // Se da clase y modifica el html interno de la singleStamp (picture) nueva
    singleStamp.classList.add(pictureClass);
    // Revisar: Cambiar formato de src a webp cuando tenga las imágenes
    singleStamp.innerHTML = `
    <source src="${getStampFilePath(pigeon.commonName)}" type="image/webp">
    <img 
        class="${imgClass}" 
        src="${getStampFilePath(pigeon.commonName)}"
        loading="lazy"
        title="${pigeon.genus} ${pigeon.species}"
        alt="${pigeon.commonName} styled as a vintage postal stamp"
    >
    `;
    return singleStamp
}

function generateDetail(pigeon) {
    /* Detail section */
    const articleLink = pigeon.articleTitle
        ? "https://en.wikipedia.org/wiki/" +
        pigeon.articleTitle.split(" ").join("_")
        : "";

    if (pigeon.genus) {
        // Revisar: poner ícono final
        /* Main info element */
        const detailMainInfo = document.getElementById('detailMainInfo');
        detailMainInfo.innerHTML = `
        <h3 class="detail__title">More about the ${pigeon.commonName}</h3>
        <p class="detail__summary">${pigeon.summary}</p>
        <a class="link detail__wiki-link" title="Go to the ${pigeon.commonName} Wikipedia Article" target="blank" rel="noopener noreferrer" href="${articleLink}">
            Wiki article
        </a>
        `
        /* /Main info element */

        /* Map element */
        const detailMapCanvas = document.getElementById('detailMapCanvas');
        const detailMapRegions = document.getElementById('detailMapRegions');
        const detailMapLocations = document.getElementById('detailMapLocations');
        
        pigeon.range.regions.forEach((region) => {
            let singleRegion = document.createElement('picture')
            singleRegion.classList.add('detail__map-picture')
            singleRegion.innerHTML = `
            <source src="assets/maps/${region}.svg" type="image/svg">
            <img class="detail__map-img" src="assets/maps/${region}.svg" alt="${translateRegionName(region)}">
            `
            detailMapCanvas.appendChild(singleRegion)
        })

        const regions = pigeon.range.regions.map((region) => translateRegionName(region)).join(', ');

        detailMapRegions.innerText = `
        living region: ${regions}
        `
        detailMapLocations.innerText = `
        locations: ${pigeon.range.locations.join(', ')}
        `
        /* /Map element */

        /* Related species element */
        pigeon.range.regions.forEach((region) => {
            // Filter by region
            const relatedSpecies = pigeonsWithSummaries.data.filter(p => p.range.regions.includes(region) && p.commonName !== pigeon.commonName);
            
            // Select 5 random related species
            const max = getRandomNumber(4, relatedSpecies.length)
            const min = max - 5
            const selectedSpecies = relatedSpecies.slice(min, max);
            console.log(selectedSpecies)

            // Create container for selected species
            let singleRegion = document.createElement('div')
            singleRegion.classList.add('detail__related-region')

            // createStamp of each selected species
            selectedSpecies.forEach((species) => {
                const selectedPigeonStamp = createStamp(species, "detail__related-picture", "detail__related-img")
                singleRegion.appendChild(selectedPigeonStamp)
            })

            // Create container for related species text
            let singleRegionText = document.createElement('p')
            singleRegionText.classList.add('detail__region-name')
            singleRegionText.innerText = `
            Other species in ${translateRegionName(region)}
            `

            // Append elements to related species container
            const detailRelatedSpecies = document.getElementById('detailRelatedSpecies');
            detailRelatedSpecies.appendChild(singleRegion)
            detailRelatedSpecies.appendChild(singleRegionText)
        })
        /* /Related species element */

        /* Postcard front element */
        let extensionType = pigeon.photos[0].split('.').pop();
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
        <h2 class="detail__common-name">${pigeon.commonName}</h2>
        <p class="detail__scientific-name">${pigeon.genus} ${pigeon.species}</p>
        `
        /* /Postcard front element */

        /* Postcard back element */
        const postcardStamp = createStamp(pigeon, "detail__postcard-stamp-picture", "detail__postcard-stamp-img")
        
        const postcardInfo = document.createElement('div')
        postcardInfo.classList.add('detail__postcard-info')
        postcardInfo.innerHTML = `
        <div class="detail__metadata">
        <p class="detail__metadatum">Common Name: ${pigeon.commonName}</p>
        <p class="detail__metadatum">Genus: ${pigeon.genus}</p>
        <p class="detail__metadatum">Species: ${pigeon.species}</p>
        <p class="detail__metadatum">Living Region: ${regions}</p>
        <p class="detail__metadatum">ConservationStatus: ${translateConservationStatus(pigeon.conservationStatus)}</p>
        </div>
        
        <a class="link detail__wiki-link" title="Go to the ${pigeon.commonName} Wikipedia Article" target="blank" rel="noopener noreferrer" href="${articleLink}">
        Wiki article
        </a>
        `

        detailPostcardBack.appendChild(postcardStamp)
        detailPostcardBack.appendChild(postcardInfo)
        /* /Postcard back element */
        
    } else {
        detailFactsheet.innerHTML = `
        <p class="text-xl">404 cucurrucucú not found</p>
        <img 
            src="assets/postal-placeholder.png"
            alt="${pigeon.genus} ${pigeon.species}"
        >
        `
    }

    // Revisar: cómo hacer que el clipboard siempre salga en la parte de la pantalla que quiero
    detail.classList.toggle("active");
    /* /Detail section */
}

// Creación de estampilla de cada paloma en stampsGrid
pigeonsWithSummaries.data.forEach((pigeon) => {
    const singleStamp = createStamp(pigeon, "stamps__picture", "stamps__img");
    stampsGrid.appendChild(singleStamp);

    singleStamp.addEventListener("click", (e) => generateDetail(pigeon));
});

// Interacciones con contenedor detalle
const cierre = document.getElementById("cierre");
cierre.addEventListener("click", () => {
    detail.classList.remove("active");
});

// Visualización de información detalle
function sendPostcardBack() {
    postcardContainer.classList.remove("top");
}

function sendFactsheetBack() {
    detailFactsheet.classList.remove("top");
}

postcardContainer.addEventListener("click", () => {
    if (postcardContainer.classList.contains("top")) {
        detailPostcardFront.classList.toggle("active");
        detailPostcardBack.classList.toggle("active");
        detailPostcardFront.classList.toggle("inactive");
        detailPostcardBack.classList.toggle("inactive");
    } else {
        postcardContainer.classList.add("top");
        sendFactsheetBack();
    }
});

detailFactsheet.addEventListener("click", () => {
    if (detailFactsheet.classList.contains("top")) {
        // Por ahora no hacer nadaP
    } else {
        detailFactsheet.classList.add("top");
        sendPostcardBack();
    }
});
