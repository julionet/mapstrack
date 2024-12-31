let map, directionsService, directionsRenderer;

// Função para inicializar o mapa
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -23.55052, lng: -46.633308 }, // Coordenadas iniciais (São Paulo, por exemplo)
        zoom: 14,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    // Inicia a atualização periódica
    updateCoordinates();
    setInterval(updateCoordinates, 60000); // Atualiza a cada 1 minuto
}

// Função para consultar a API e traçar a rota
async function updateCoordinates() {
    try {
        const response = await fetch('URL_DA_API');
        if (!response.ok) throw new Error("Erro ao buscar coordenadas");

        const coordinates = await response.json();
        if (coordinates.length < 2) {
            console.error("São necessárias pelo menos duas coordenadas para traçar uma rota");
            return;
        }

        const waypoints = coordinates.slice(1, -1).map(coord => ({
            location: new google.maps.LatLng(coord.latitude, coord.longitude),
            stopover: false,
        }));

        const request = {
            origin: new google.maps.LatLng(coordinates[0].latitude, coordinates[0].longitude),
            destination: new google.maps.LatLng(coordinates[coordinates.length - 1].latitude, coordinates[coordinates.length - 1].longitude),
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
            } else {
                console.error("Falha ao traçar rota: ", status);
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar coordenadas: ", error);
    }
}

// Inicializa o mapa
window.onload = initMap;
