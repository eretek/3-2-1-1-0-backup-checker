/*! Eretek Online Araçlar #62 — Backup Kapsamı ve 3-2-1-1-0 Kontrolü */
ERT.def('62', {
	run: function (v, c) {
		var r = c.csv(v.csv, 'csv', 5000), H = r.head, col = function (n) { return ERT.csv.col(H, n); };
		var iS = col(['system', 'sistem']), iC = col(['copy', 'kopya']), iM = col(['media', 'ortam']), iO = col(['offsite', 'disarida']), iI = col(['immutable', 'offline', 'degistirilemez']), iV = col(['verified', 'test', 'dogrulandi']);
		if (iS < 0 || iM < 0 || iO < 0 || iI < 0 || iV < 0) { throw c.fe('csv', 'col', { c: 'system, copy, media, offsite, immutable, verified' }); }
		var yes = function (s) { s = ERT.norm(s); if (/^(yes|y|evet|e|ja|j|true|1|x)$/.test(s)) { return true; } if (/^(no|n|hayir|h|nein|false|0|-|)$/.test(s)) { return false; } return null; };
		var S = {}, order = [];
		r.rows.forEach(function (x, i) {
			var o = yes(x[iO]), im = yes(x[iI]), vf = yes(x[iV]);
			if (o === null || im === null || vf === null || !x[iS] || !x[iM]) { throw c.fe('csv', 'rowYn', { r: i + 2 }); }
			if (!S[x[iS]]) { S[x[iS]] = []; order.push(x[iS]); }
			S[x[iS]].push({ m: ERT.norm(x[iM]), o: o, i: im, v: vf, c: iC >= 0 ? x[iC] : '' });
		});
		var rows = [], cls = [], res = {}, bad = 0, mk = function (b) { return b ? '✓' : '✗'; };
		order.forEach(function (s) {
			var L = S[s], media = {}, k3 = L.length >= 3, ok;
			L.forEach(function (x) { media[x.m] = 1; });
			var k2 = Object.keys(media).length >= 2, k1 = L.some(function (x) { return x.o; }), k1b = L.some(function (x) { return x.i; }), k0 = L.every(function (x) { return x.v; });
			ok = k3 && k2 && k1 && k1b && k0; if (!ok) { bad++; }
			res[s] = [k3, k2, k1, k1b, k0];
			var miss = []; if (!k3) { miss.push(c.t('f3')); } if (!k2) { miss.push(c.t('f2')); } if (!k1) { miss.push(c.t('f1')); } if (!k1b) { miss.push(c.t('f1b')); } if (!k0) { miss.push(c.t('f0')); }
			rows.push([s, L.length, Object.keys(media).length, mk(k3), mk(k2), mk(k1), mk(k1b), mk(k0), miss.join('; ') || c.t('okS')]); cls.push(ok ? 'ok' : 'err');
		});
		var cols = [c.t('c_s'), c.t('c_n'), c.t('c_m'), '3', '2', '1', '1', '0', c.t('c_miss')];
		var msgs = [bad ? ['err', c.t('nBad', { n: bad, t: order.length })] : ['ok', c.t('allOk')], ['info', c.t('rule')], ['info', c.t('prod')]];
		return { big: c.t('big', { n: order.length - bad, t: order.length }), msgs: msgs, tables: [{ cols: cols, rows: rows, cls: cls }], x: { csv: { name: '3-2-1-1-0', cols: cols, rows: rows } }, v: { result: res, bad: bad } };
	}
});
