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
                { data: 'Borough', width: '8%' },
                { 
                    data: 'Crew',
                    width: '12%',
                    render: function(data, type, row) {
                        if (type === 'display' && data) {
                            return '<div class="wrap-text" title="' + data.replace(/"/g, '&quot;') + '">' + data + '</div>';
                        }
                        return data;
                    }
                },
                { 
                    data: 'Website',
                    width: '6%',
                    render: function(data, type, row) {
                        if (type === 'display' && data) {
                            return '<a href="' + data + '" target="_blank">Link</a>';
                        }
                        return data;
                    }
                },
                { 
                    data: 'Location',
                    width: '18%',
                    render: function(data, type, row) {
                        if (type === 'display' && data) {
                            return '<div class="wrap-text" title="' + data.replace(/"/g, '&quot;') + '">' + data + '</div>';
                        }
                        return data;
                    }
                },
                { data: 'Day', width: '6%' },
                { 
                    data: 'Distance/Run Type',
                    width: '10%',
                    render: function(data, type, row) {
                        if (type === 'display' && data) {
                            return '<div class="wrap-text" title="' + data.replace(/"/g, '&quot;') + '">' + data + '</div>';
                        }
                        return data;
                    }
                },
                { data: 'Time', width: '8%' },
                { 
                    data: 'Meet Up Information',
                    width: '32%',
                    render: function(data, type, row) {
                        if (type === 'display' && data) {
                            return '<div class="wrap-text" title="' + data.replace(/"/g, '&quot;') + '">' + data + '</div>';
                        }
                        return data;
                    }
                }
            ],
            deferRender: true,
            scrollY: '60vh',
            scrollCollapse: true,
            scroller: true,
            pageLength: 50,
            responsive: true,
            ordering: false,
            order: [[0, 'asc'], [1, 'asc']],
            dom: '<"top"f>rt<"bottom"i>',
            language: {
                info: "Showing _START_ to _END_ of _TOTAL_ clubs",
                infoFiltered: "(filtered from _MAX_ total clubs)"
            }
        });

        // Custom filtering function
        $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
            let borough = $('#boroughFilter').val();
            let day = $('#dayFilter').val();
            let time = $('#timeFilter').val();
            
            let rowBorough = data[0];  // Borough column
            let rowStatus = row.Status; // Get status from the raw data
            let rowDay = data[4];      // Day column (index changed)
            let rowTime = data[6];     // Time column (index changed)
            
            // Status filter - only show Active
            if (rowStatus !== 'Active') return false;
            
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