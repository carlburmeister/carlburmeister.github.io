/*  CKB NOTE: THIS IS CODEX GENERATED CODE  */

/***************************************************************************************************/
//	Data loading helpers
/***************************************************************************************************/
function resolveDataCsvPath(relativePath)
{
	if (!relativePath) {
		return relativePath;
	}
	var absolutePattern = /^([a-z]+:)?\/\//i;
	if (absolutePattern.test(relativePath) || relativePath.charAt(0) === '/') {
		return relativePath;
	}

	var script = document.currentScript;
	if (!script) {
		var scripts = document.getElementsByTagName('script');
		if (scripts.length) {
			script = scripts[scripts.length - 1];
		}
	}

	if (script && script.src)
	{
		if (typeof window.URL === 'function') {
			try {
				return new URL(relativePath, script.src).href;
			}
			catch (error) {
				// ignore and fall back to string concatenation
			}
		}

		var lastSlashIndex = script.src.lastIndexOf('/');
		if (lastSlashIndex === -1) {
			return relativePath;
		}
		var scriptDirectory = script.src.substring(0, lastSlashIndex + 1);
		return scriptDirectory + relativePath;
	}

	return relativePath;
}

function loadPieceAssetsFromCsv(pieceIdentifier)
{
	var csvText = loadXMLDoc(dataCsvPath);
	var csvObjects = csvTextToObjects(csvText);
	var normalizedId = (pieceIdentifier || '').toLowerCase();
	for (var i = 0; i < csvObjects.length; i++) {
		var candidate = csvObjects[i];
		var candidateId = candidate.id ? candidate.id.toLowerCase() : '';
		if (candidateId === normalizedId) {
			return normalizeCsvRecord(candidate);
		}
	}

	if (debug) {
		console.warn('No data found for piece id:', pieceIdentifier);
	}

	return {};
}

function normalizeCsvRecord(record)
{
	var normalized = {};
	for (var key in record) {
		if (!record.hasOwnProperty(key) || key === '') {
			continue;
		}

		var value = record[key];
		if (typeof value === 'string') {
			value = value.replace(/\r/g, '').trim();
		}
		if (value === undefined || value === null) {
			value = '';
		}

		if (typeof value === 'string' && value.indexOf(':') > -1) {
			var splitValues = value.split(':');
			for (var idx = 0; idx < splitValues.length; idx++) {
				splitValues[idx] = splitValues[idx].trim();
			}
			normalized[key] = splitValues.length > 1 ? splitValues : (splitValues[0] || '');
		}
		else {
			normalized[key] = value;
		}
	}
	return normalized;
}

function csvTextToObjects(csvText)
{
	var rows = parseCsv(csvText || '');
	if (!rows.length) {
		return [];
	}

	var headers = rows.shift();
	if (!headers.length) {
		return [];
	}

	for (var h = 0; h < headers.length; h++) {
		if (!headers[h]) {
			continue;
		}
		headers[h] = headers[h].replace(/^\uFEFF/, '').trim();
	}

	var objects = [];
	for (var r = 0; r < rows.length; r++) {
		var row = rows[r];
		if (!row.length || row.join('').trim() === '') {
			continue;
		}

		var obj = {};
		for (var c = 0; c < headers.length; c++) {
			if (!headers[c]) {
				continue;
			}
			obj[headers[c]] = typeof row[c] !== 'undefined' ? row[c] : '';
		}
		objects.push(obj);
	}

	return objects;
}

function parseCsv(text)
{
	var rows = [];
	var row = [];
	var current = '';
	var insideQuotes = false;

	for (var i = 0; i < text.length; i++) {
		var char = text[i];
		var nextChar = text[i + 1];

		if (char === '"') {
			if (insideQuotes && nextChar === '"') {
				current += '"';
				i++;
			}
			else {
				insideQuotes = !insideQuotes;
			}
		}
		else if (char === ',' && !insideQuotes) {
			row.push(current);
			current = '';
		}
		else if ((char === '\n' || char === '\r') && !insideQuotes) {
			if (char === '\r' && nextChar === '\n') {
				i++;
			}
			row.push(current);
			rows.push(row);
			row = [];
			current = '';
		}
		else {
			current += char;
		}
	}

	if (current !== '' || row.length) {
		row.push(current);
		rows.push(row);
	}

	return rows;
}
