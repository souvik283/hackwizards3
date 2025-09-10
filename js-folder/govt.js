

const SUPABASE_URL = "https://qitewsgbwhvayhhlcqud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdGV3c2did2h2YXloaGxjcXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTM2NTIsImV4cCI6MjA3MjYyOTY1Mn0.zeBbI8MENQTrkxzwG4GKXvHQ8SOUt4qBDxsSCw7iBEU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    const { data, error } = await supabaseClient
        .from("Argha")
        .select("*")

    if (error) {
        console.error("Failed to fetch:", error);
        return;
    }

    // Create an array from the rows

    const wasteReports = data.map((row) => {
        if (!row.loc) {
            return {
                id: row.id,
                description: row.des,
                url: row.img_url,
                date: row.date,
                lat: null,
                lon: null
            };
        }

        const parts = row.loc.split(",");
        return {
            id: row.id,
            description: row.des,
            location: row.loc,
            url: row.img_url,
            date: row.date,
            lat: parseFloat(parts[0].trim()),
            lon: parseFloat(parts[1].trim())
        };
    });



    console.log("Array created:", wasteReports);



    //   if (myArray.length > 0) {
    //     console.log("First item description:", myArray[0].description);
    //   }


    await renderTable(wasteReports);
    await initMap(wasteReports);
    // setupEventListeners();


});



// DOM Elements
const tableContainer = document.getElementById('table-container');
const mapElement = document.getElementById('map');
const imageContainer = document.querySelector('.image-container');
const descriptionContainer = document.querySelector('.description-container');
const dispatchButton = document.getElementById('dispatch-btn');

// Map and marker variables
let map;
let markers = [];
let selectedReportId = null;

// Initialize the page
// document.addEventListener('DOMContentLoaded', function () {
// Simulate loading data from database with a slight delay
//     setTimeout(() => {
//         renderTable();
//         initMap();
//         setupEventListeners();
//     }, 1000);
// });

// Render data table
function renderTable(wasteReports) {
    if (wasteReports.length === 0) {
        tableContainer.innerHTML = '<p class="no-data">No waste reports found</p>';
        return;
    }

    let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>UserId</th>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

    wasteReports.forEach(report => {
        const formattedDate = new Date(report.datetime).toLocaleString();
        tableHTML += `
                    <tr data-id="${report.id}" class="${report.id === selectedReportId ? 'selected' : ''}">
                        <td>${report.id}</td>
                        <td>${report.date}</td>
                        <td> ${report.lat}, ${report.lon}</td>
                        <td>${report.description}</td>
                    </tr>
                `;
    });

    tableHTML += `
                    </tbody>
                </table>
            `;

    tableContainer.innerHTML = tableHTML;

    // Add click event to table rows
    document.querySelectorAll('table tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const reportId = parseInt(row.getAttribute('data-id'));
            selectReport(reportId, wasteReports);
        });
    });
}

// Initialize the map (using OpenStreetMap with Leaflet)
function initMap(wasteReports) {
    // Create the map centered on a default location
    map = L.map('map').setView([39.8283, -98.5795], 4); // Center of US

    // Add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add markers for all reports
    wasteReports.forEach(report => {
        addMarkerToMap(report, wasteReports);
    });

}
// Add a marker to the map
function addMarkerToMap(report, wasteReports) {

    const marker = L.marker([report.lat, report.lon])
        .addTo(map)
        .bindPopup(`<b>${report.lat}</b><br>${report.lon}`);

    // Store the marker with its report ID
    markers[report.id] = marker;

    // Add click event to marker
    marker.on('click', () => {
        selectReport(report.id, wasteReports);
    });
}



// Select a report and update the UI
function selectReport(reportId, wasteReports) {
    selectedReportId = reportId;

    // Update table selection
    document.querySelectorAll('table tbody tr').forEach(row => {
        if (parseInt(row.getAttribute('data-id')) === reportId) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    });

    // Find the selected report
    const report = wasteReports.find(r => r.id === reportId);

    if (report) {
        // Update image and description
        imageContainer.innerHTML = `<img src="${report.url}" alt="Waste report image">`;
        descriptionContainer.innerHTML = `<p>${report.description}</p>`;

        // Enable dispatch button
        dispatchButton.disabled = false;

        // Highlight the marker on the map
        if (markers[reportId]) {
            // Close any open popups
            map.closePopup();

            // Open the popup for this marker
            markers[reportId].openPopup();

            // Center the map on this marker with animation

            map.flyTo([report.lat, report.lon], 13, {
                animate: true,
                duration: 1
            });
        }
    }
}

