function insert_row() {
    console.log("Inserting new row");
    var tablepath = window.location.pathname.match('/[^/]*')[0];
    httpGetAsync(tablepath + '/getcolumns', function (e, t) {
        if (!e) {
            var columns = JSON.parse(t).filter(column => column !== 'ID');
            var new_row = document.createElement("tr");
            new_row.setAttribute("class", "buffered-row");
            columns.forEach(function (column) {
                var cell = document.createElement("td");
                cell.setAttribute("class", "datacell");
                cell.setAttribute("name", column);
                var textarea = document.createElement("textarea");
                textarea.setAttribute("class", "form-control datatext");
                textarea.setAttribute("rows", 1);
                cell.appendChild(textarea);
                new_row.appendChild(cell);
            });
            var modifying_buttons = document.createElement("td");
            modifying_buttons.innerHTML = '<div class="btn-group-vertical">\
            <button type="button" class="btn btn-default" name="insert">Insert</button>\
            <button type="button" class="btn btn-default" name="delete">Delete</button>\
            </div>';
            new_row.appendChild(modifying_buttons);
            $('#tablecontents').each(function () {
                console.log(this);
                this.insertBefore(new_row, this.lastChild);
            });
            $('.buffered-row').find('button[name=insert]').click(function () {
                $(this).parents('.buffered-row').each(function () {
                    var data = {};
                    $(this).children('.datacell').each(function () {
                        data[$(this).attr('name')] = $(this).children('textarea').val();
                    });
                    httpPostAsync(tablepath + '/insert', data, function (e, t) {
                        if (!e) {
                            getTableContents();
                            new_alert('info', t);
                        }
                        else {
                            new_alert('danger', t);
                        }
                    });
                });
            });
            $('.buffered-row').find('button[name=delete]').click(function () {
                $(this).parents('.buffered-row').remove();
            });
        }
        else {
            console.log(e);
            new_alert('danger', t);
        }
    });
}

function translate2table(table_object) {
    var columns = [];
    var data = [];
    if (table_object) {
        for (var key in table_object[0]) {
            if (key !== 'ID')
                columns.push(key);
        }
        table_object.forEach(function (row) {
            var row_content = [];
            columns.forEach(function (column) {
                row_content.push(row[column]);
            })
            data.push({ id: row.ID, data: row_content });
        });
    }
    return { head: columns, body: data };
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function () {
        if (xmlHttp.status == 200)
            callback(null, xmlHttp.responseText);
        else {
            callback(xmlHttp.statusText, xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function httpPostAsync(theUrl, data, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function () {
        if (xmlHttp.status == 200)
            callback(null, xmlHttp.responseText);
        else {
            callback(xmlHttp.statusText, xmlHttp.responseText);
        }
    }
    xmlHttp.open("POST", theUrl, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xmlHttp.send(JSON.stringify(data));
}

function getTableList() {
    httpGetAsync("/tables", function (s, t) {
        var tblist = document.getElementById("tables");
        tblist.innerHTML = "";
        var tables = JSON.parse(t);
        tables.forEach(function (table_name) {
            var child = document.createElement("a");
            child.setAttribute("class", "list-group-item");
            child.setAttribute("href", "/" + table_name + "/show");
            child.innerHTML = table_name;
            tblist.appendChild(child);
        });
    });
}

function getTableContents() {
    var contents = [];
    var tablepath = window.location.pathname.match('/[^/]*')[0];
    httpGetAsync(tablepath + '/get', function (e, t) {
        if (!e) {
            contents = translate2table(JSON.parse(t));
            setTable("data", contents.head, contents.body);
            $(".datatext").dblclick(function () {
                this.removeAttribute('readonly');
            });
        }
        else {
            console.log(e);
            new_alert('danger', t);
        }
    });
}

function createContent() {
    getTableList();
    if (window.location.pathname == '/') {
    }
    else
        getTableContents();
}

function update_row(row_id) {
    console.log("Trying to update row " + row_id);
    var contents = [];
    var tablepath = window.location.pathname.match('/[^/]*')[0];

    httpGetAsync(tablepath + '/getcolumns', function (e, t) {
        if (!e) {
            var data = {};
            var columns = JSON.parse(t).filter(column => column !== 'ID');
            $('#' + row_id).children('.datacell').each(function (index) {
                data[columns[index]] = $(this).children('textarea').val();
            });
            httpPostAsync(tablepath + '/update?id=' + row_id, data, function (e, t) {
                if (!e) {
                    getTableContents();
                    new_alert('info', t);
                }
                else {
                    new_alert('danger', t);
                }
            });
        }
        else {
            console.log(e);
            new_alert('danger', t);
        }
    });
}

function delete_row(row_id) {
    console.log("Trying to delete row " + row_id);
    var tablepath = window.location.pathname.match('/[^/]*')[0];
    console.log(tablepath);
    httpGetAsync(tablepath + '/delete?id=' + row_id, function (e, t) {
        if (!e) {
            getTableContents();
            new_alert('info', 'Row deleted');
        }
        else {
            new_alert('danger', 'Error deleting row: ' + t);
        }
    });
}

function new_alert(alert_type, alert_text) {
    var alert = document.createElement("div");
    alert.setAttribute("class", "alert alert-" + alert_type + " alert-dismissible fade show");
    alert.setAttribute("role", "alert");
    alert.innerHTML = ''
        + alert_text
        + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
        + '<span aria-hidden="true">&times;</span>'
        + '</button>';
    var mainform = document.getElementById('mainform');
    mainform.insertBefore(alert, mainform.firstChild);
}
function setTable(tableId, tableHead, tableData) {
    var table = document.getElementById(tableId);
    table.innerHTML = "";

    var tableHeadRow = document.createElement("tr");
    tableHead.forEach(function (column) {
        var cell = document.createElement("th");
        cell.appendChild(document.createTextNode(column));
        tableHeadRow.appendChild(cell);
    });

    table.appendChild(tableHeadRow);

    var tableBody = document.createElement("tbody");
    tableBody.setAttribute("id", "tablecontents");
    tableData.forEach(function (rowData) {
        var row = document.createElement("tr");
        row.setAttribute("id", rowData.id);

        var modifying_buttons = document.createElement("td");
        modifying_buttons.innerHTML = '<div class="btn-group-vertical">\
        <button type="button" class="btn btn-outline-primary" onclick="update_row(\'' + rowData.id + '\')">Update</button>\
        <button type="button" class="btn btn-outline-danger" onclick="delete_row(\'' + rowData.id + '\')">Delete</button>\
        </div>';

        rowData.data.forEach(function (cellData, index) {
            var cell = document.createElement("td");
            cell.setAttribute("class", "datacell");
            cell.setAttribute("name", tableHead[index]);
            var textarea = document.createElement("textarea");
            textarea.setAttribute("class", "form-control datatext");
            textarea.setAttribute("rows", 1);
            textarea.setAttribute("readonly", true);
            textarea.appendChild(document.createTextNode(cellData));
            cell.appendChild(textarea);
            row.appendChild(cell);
        });
        row.appendChild(modifying_buttons);
        tableBody.appendChild(row);
    });
    var inserting_row = document.createElement("tr");
    // var inserting_cell = document.createElement("td");
    //  inserting_cell.setAttribute("colspan", tableHead.length + 1);

    var new_row_button = document.createElement("td");
    new_row_button.setAttribute("colspan", tableHead.length + 1);
    new_row_button.setAttribute("class", "btn-default");
    new_row_button.setAttribute("onclick", "insert_row()");
    new_row_button.appendChild(document.createTextNode("Insert new row"));

    //   inserting_cell.appendChild(new_row_button);
    inserting_row.appendChild(new_row_button);
    tableBody.appendChild(inserting_row);

    table.appendChild(tableBody);

    //pagination added
    $(document).ready(function () {
        $('#data').after('<div id="nav"></div>');
        var rowsShown = 100;
        var rowsTotal = $('#data tbody tr').length;
        var numPages = rowsTotal / rowsShown;
        for (i = 0; i < numPages; i++) {
            var pageNum = i + 1;
            $('#nav').append('<a href="#" rel="' + i + '">' + pageNum + '</a> ');
        }
        $('#data tbody tr').hide();
        $('#data tbody tr').slice(0, rowsShown).show();
        $('#nav a:first').addClass('active');
        $('#nav a').bind('click', function () {

            $('#nav a').removeClass('active');
            $(this).addClass('active');
            var currPage = $(this).attr('rel');
            var startItem = currPage * rowsShown;
            var endItem = startItem + rowsShown;
            $('#data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
                css('display', 'table-row').animate({ opacity: 1 }, 300);
        });
    });
}
