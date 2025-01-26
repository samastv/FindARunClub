$(document).ready(function() {
    $.ajax({
        url: 'data.csv',
        dataType: 'text',
    }).done(function(csvData) {
        let data = $.csv.toObjects(csvData);
        
        $('#crewTable').DataTable({
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
    }).fail(function(error) {
        console.error('Error loading CSV:', error);
    });
}); 