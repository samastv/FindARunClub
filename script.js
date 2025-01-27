$(document).ready(function() {
    let table;

    // Update the time filter preposition handler
    $('#timeFilter').on('change', function() {
        const timePreposition = $('#timePreposition');
        const selectedValue = $(this).val();
        if (selectedValue === '') {
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
                { 
                    data: 'Time', 
                    width: '8%',
                    render: function(data, type, row) {
                        if (type === 'sort') {
                            if (!data) return -1;
                            let timeStr = data.trim().toUpperCase();
                            let [time, period] = timeStr.split(' ');
                            let [hours, minutes] = time.split(':').map(Number);
                            
                            if (period === 'PM' && hours !== 12) hours += 12;
                            if (period === 'AM' && hours === 12) hours = 0;
                            
                            return hours * 60 + (minutes || 0);
                        }
                        return data;
                    }
                },
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
            deferRender: false,
            scrollY: window.innerWidth <= 768 ? '' : '60vh',
            scrollCollapse: false,
            scroller: false,
            pageLength: -1,
            responsive: true,
            ordering: true,
            order: [[6, 'asc']],
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
            let rowDay = data[4];      // Day column
            let rowTime = data[6];     // Time column
            
            // Get the full row data to access Status
            let rowData = table.row(dataIndex).data();
            
            // Status filter - only show Active
            if (rowData.Status !== 'Active') return false;
            
            // Borough filter
            if (borough && borough !== rowBorough) return false;
            
            // Day filter
            if (day && !rowDay.includes(day)) return false;
            
            // Time filter
            if (time) {
                let timeStr = rowTime.trim().toUpperCase();
                let hour = parseInt(timeStr);
                let isPM = timeStr.includes('PM');
                
                // Convert to 24-hour format if needed
                if (isPM && hour !== 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;
                
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