(function($) {
	if(!$) throw 'Require jQuery';
	
	Handlebars.registerHelper('repeat', function(num, options) {
		var buf = [];
		for(var i=0; i<num; i++) {
			buf.push(options.fn(i));
		}
		return buf.join('')
	});
	
	$(function() {
		console.log('Running Gos');
		
		var toJs = function(txt) {
			return eval('(function(arg){return arg;})('+txt+')');
		}
		
		$('[gos]').each(function() {
			var dataText = $('.data', this).remove().html();
			
			var configText = $('.config', this).remove().html();
			
			var data = toJs(dataText);
			var config = toJs(configText);
			
			console.log("data", data);
			console.log("config", config);
			
			//see what is left inside
			var tpl = $(this).html();
			var tFn = Handlebars.compile(tpl);
			
			var buf = $.isArray(data) ? data.map(function(ctx) { return tFn(ctx);}).join('') : tFn(data);
			$(this).html(buf);
			
			var gos = $(this).attr('gos');
			if(gos) {
				//call component hat
				$(this)[gos](config);
			}
		});		
	});
})(jQuery);