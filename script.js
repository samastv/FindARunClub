$(document).ready(function() {
    let table;

    // Add time filter preposition handler
    $('#timeFilter').on('change', function() {
        const timePreposition = $('#timePreposition');
        if ($(this).val() === '') {
            timePreposition.text('at');
        } else {
            timePreposition.text('in the');
        }
    });

    $.ajax({
        url: 'data.csv',
        dataType: 'text',
    }).done(function(csvData) {
        let data = $.csv.toObjects(csvData);
        
        table = $('#crewTable').DataTable({
            data: data,
            columns: [
                { data: 'Borough' },
                { data: 'Crew' },
                { data: 'Status' },
                { 
                    data: 'Website',
                    render: function(data, type, row) {
                        if (type === 'display' && data) {
                            return '<a href="' + data + '" target="_blank">Link</a>';
                        }
                        return data;
                    }
                },
                { data: 'Location' },
                { data: 'Day' },
                { data: 'Distance/Run Type' },
                { data: 'Time' },
                { data: 'Meet Up Information' },
                { data: 'Recognized Organizations' }
            ],
            pageLength: 25,
            responsive: true,
            order: [[0, 'asc'], [1, 'asc']]
        });

        // Custom filtering function
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            let borough = $('#boroughFilter').val();
            let day = $('#dayFilter').val();
            let time = $('#timeFilter').val();
            
            let rowBorough = data[0];  // Borough column
            let rowDay = data[5];      // Day column
            let rowTime = data[7];     // Time column
            
            // Borough filter
            if (borough && borough !== rowBorough) return false;
            
            // Day filter
            if (day && !rowDay.includes(day)) return false;
            
            // Time filter
            if (time) {
                let hour = parseInt(rowTime.split(':')[0]);
                if (!hour) return false;
                
                switch(time) {
                    case 'morning':
                        if (!(hour >= 5 && hour < 12)) return false;
                        break;
                    case 'afternoon':
                        if (!(hour >= 12 && hour < 17)) return false;
                        break;
                    case 'evening':
                        if (!(hour >= 17 || hour < 5)) return false;
                        break;
                }
            }
            
            return true;
        });

        // Event listeners for filter changes
        $('.filter-select').on('change', function() {
            table.draw();
        });
    }).fail(function(error) {
        console.error('Error loading CSV:', error);
    });
}); 