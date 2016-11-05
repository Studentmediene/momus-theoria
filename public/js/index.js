// Todo: do everything

var loadData = function() {
    $.ajax({
        type: "GET",
        url: "http://10.24.18.119:8080/api/public/test",
        crossDomain:true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa("test:testesen"));
        },
        success: function(data){
            console.log(data);
        }
    })
};


loadData();