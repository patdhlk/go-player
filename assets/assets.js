var root = "/f/";
var path = [];
var cache = {};

function init() {
	load(path);
	$('#player').bind('ended', next);
	$('#addall').click(addAll);
	$('#next').click(next);
}

function load(path)  {
	var url = root+path.join('/');
	if (typeof cache[url] != "undefined") {
		populate(cache[url]);
		return;
	}
	$.ajax({
		url: url,
		dataType: "json",
		success: function(data) {
			populate(data)
			cache[url] = data;
		}
	});
}

function populate(files) {
	var $b = $('#browser').empty();
	function add(i, f) {
		if (f.Name[0] == '.' || f.Name[0] == ':') return;
    var dir = f.IsDir;
		var cl = dir ? "dir" : "file";
		f.Path = path.join('/');
		$('<a></a>').text(f.Name).data('file', f)
			.addClass(cl).appendTo($b)
			.click(dir?clickDir:clickFile);
	}
	files.sort(function(a, b) {
		a = a.Name.toLowerCase();
		b = b.Name.toLowerCase();
		if (a > b) return 1;
		if (a < b) return -1;
		return 0;
	});
	$b.append(up());
	$.each(files, add);
}

function up() {
	return $('<a class="dir">..</a>').click(function() {
		path.pop();
		load(path);
	});
}

function clickDir(e) {
	path.push($(e.target).data('file').Name);
	load(path);
}
function clickFile(e) {
	addToPlaylist($(e.target).data('file'));
}

function addToPlaylist(f) {
	var $p = $('#playlist');
	var playnow = ($p.find('a').length == 0);
	var $d = $('<a></a>').text(f.Name).data('file', f)
		.appendTo($p)
		.click(function(e) { play(e.target); });
	if (playnow) $d.click();
}

function addAll() {
	$('#browser a.file').each(function(i, e) {
		addToPlaylist($(e).data('file'));
	});
}

function play(el) {
	var name = $(el).data('file').Name;
	var path = $(el).data('file').Path;
	var url = root+path+'/'+name;
	$('#playlist a').removeClass('playing');
	$(el).addClass('playing')
	$('#player').attr('src', url);
}

function next() {
	var $next = $('#playlist a.playing').next();
	if ($next.length) play($next);
}
google.load("jquery", "1.4.2");
google.setOnLoadCallback(init);