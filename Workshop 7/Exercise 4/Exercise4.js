function loadAndParseNews() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 1) {
            document.getElementById('newsfeed').innerHTML = 'Work in progress...';
        }
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var xmlDoc = xmlhttp.responseXML;
            console.log(xmlDoc);
            var items = xmlDoc.getElementsByTagName("item");
            var item, feedlink, name, description, content = '';
            for (let i = 0; i < items.length; i++) {
                feedlink = items[i].getElementsByTagName('link').item(0).firstChild.nodeValue;
                name = items[i].getElementsByTagName('title').item(0).firstChild.nodeValue;
                item = '<li>' + name + '</li>';
                item = '<li><a href="' + feedlink + '">' + name + '</a></li>';
                content += item;
            }
            document.getElementById('newsfeed').innerHTML = "<ul>" + content + "</ul>";
        }
    }
    xmlhttp.open("GET", "http://www.iltalehti.fi/rss/uutiset.xml", true);
    xmlhttp.send();
};
