const DIC_NAME = 'naist-jdic';
const POSID = [
	['その他', '間投'], // 0
	['フィラー'], // 1
	['感動詞'], // 2
	['記号', 'アルファベット'], // 3
	['記号', '一般'], // 4
	['記号', '括弧開'], // 5
	['記号', '括弧閉'], // 6
	['記号', '句点'], // 7
	['記号', '空白'], // 8
	['記号', '読点'], // 9
	['形容詞', '自立'], // 10
	['形容詞', '接尾'], // 11
	['形容詞', '非自立'], //12
	['助詞', '格助詞', '一般'], // 13
	['助詞', '格助詞', '引用'], // 14
	['助詞', '格助詞', '連語'], // 15
	['助詞', '係助詞'], // 16
	['助詞', '終助詞'], // 17
	['助詞', '接続助詞'], // 18
	['助詞', '特殊'], // 19
	['助詞', '副詞化'], // 20
	['助詞', '副助詞'], // 21
	['助詞', '副助詞／並立助詞／終助詞'], // 22
	['助詞', '並立助詞'], // 23
	['助詞', '連体化'], // 24
	['助動詞'], // 25
	['接続詞'], // 26
	['接頭詞', '形容詞接続'], // 27
	['接頭詞', '数接続'], // 28
	['接頭詞', '動詞接続'], // 29
	['接頭詞', '名詞接続'], // 30
	['動詞', '自立'], // 31
	['動詞', '接尾'], // 32
	['動詞', '非自立'], // 33
	['副詞', '一般'], // 34
	['副詞', '助詞類接続'], // 35
	['名詞', 'サ変接続'], // 36
	['名詞', 'ナイ形容詞語幹'], // 37
	['名詞', '一般'], // 38
	['名詞', '引用文字列'], // 39
	['名詞', '形容動詞語幹'], // 40
	['名詞', '固有名詞', '一般'], // 41
	['名詞', '固有名詞', '人名', '一般'], // 42
	['名詞', '固有名詞', '人名', '姓'], // 43
	['名詞', '固有名詞', '人名', '名'], // 44
	['名詞', '固有名詞', '組織'], // 45
	['名詞', '固有名詞', '地域', '一般'], // 46
	['名詞', '固有名詞', '地域', '国'], // 47
	['名詞', '数'], // 48
	['名詞', '接続詞的'], // 49
	['名詞', '接尾', 'サ変接続'], // 50
	['名詞', '接尾', '一般'], // 51
	['名詞', '接尾', '形容動詞語幹'], // 52
	['名詞', '接尾', '助数詞'], // 53
	['名詞', '接尾', '助動詞語幹'], // 54
	['名詞', '接尾', '人名'], // 55
	['名詞', '接尾', '地域'], // 56
	['名詞', '接尾', '特殊'], // 57
	['名詞', '接尾', '副詞可能'], // 58
	['名詞', '代名詞', '一般'], // 59
	['名詞', '代名詞', '縮約'], // 60
	['名詞', '動詞非自立的'], // 61
	['名詞', '特殊', '助動詞語幹'], // 62
	['名詞', '非自立', '一般'], // 63
	['名詞', '非自立', '形容動詞語幹'], // 64
	['名詞', '非自立', '助動詞語幹'], // 65
	['名詞', '非自立', '副詞可能'], // 66
	['名詞', '副詞可能'], // 67
	['連体詞'], // 68
];
const UNKNOWN_DEFINITION = [
	{ name: 'DEFAULT', invoke: false }, // 0
	{ name: 'SPACE', invoke: true, regexp: /^\s+$/ }, // 1
	{ name: 'KANJI', invoke: false, regexp: /^[⺀-⻳⼀-⿕々〇㐀-䶵一-龥豈-鶴侮-頻]{1,2}$/ }, // 2
	{ name: 'SYMBOL', invoke: true, regexp: /^[!-\/:-@\[-`\{-~¡-¿À-ȶḀ-ỹ！-／：-＠［-｀｛-･￠-\uffef\u2000-\u206f₠-⅏←-⥿⨀-\u2bff\u3000-\u303f㈀-㏿︰-﹫]+$/ }, // 3
	{ name: 'NUMERIC', invoke: true, regexp: /^[0-9０-９⁰-\u209f⅐-\u218f]+$/ }, // 4
	{ name: 'ALPHA', invoke: true, regexp: /^[A-Za-zＡ-Ｚａ-ｚ]+$/ }, // 5
	{ name: 'HIRAGANA', invoke: false, regexp: /^[ぁ-ゟー]+$/ }, // 6
	{ name: 'KATAKANA', invoke: true, regexp: /^[ァ-ヿㇰ-ㇿｦ-ﾝﾞﾟ]+$/ }, // 7
	{ name: 'KANJINUMERIC', invoke: true, regexp: /^[〇一二三四五六七八九十百千万億兆京]+$/ }, // 8
	{ name: 'GREEK', invoke: true, regexp: /^[ʹ-ϻ]+$/ }, // 9
	{ name: 'CYRILLIC', invoke: true, regexp: /^[Ѐ-ӹԀ-ԏ]+$/ }, // 10
];
const BOS = {
	word: '\x02',
	id: 0,
	cost: 0,
	start: 0,
	end: 1,
};
const EOS = {
	word: '\x03',
	id: 0,
	cost: 0,
};

class Path extends Array {
	constructor(length) {
		super();
		this.length = length || 0;
		this.cost = 0;
	}
	format() {
		let costs = this.costs;
		let cost = this.cost;
		let newPath = Path.from(this.slice(1, this.length-1));
		newPath.costs = costs;
		newPath.cost = cost;
		return newPath;
	}
}
Path.from = arraylike => {
	let length = arraylike.length;
	let path = new Path(length)
	for (let i = 0; i < length; i++) path[i] = arraylike[i];
	return path;
};

class Lattice {
	constructor(input) {
		this.input = [...input];
	}
	lookup(unkDic) {
		let chars = this.input;
		const CHAR_LENGTH = chars.length;
		return new Promise((resolve, reject) => {
			indexedDB.open(DIC_NAME).onsuccess = e => {
				let db = e.target.result;
				let dic = db.transaction(['dictionary'], 'readonly').objectStore('dictionary').index('index');
				let targets = [], promises = [];
				for (let i = 0; i < CHAR_LENGTH; i++) {
					for (let j = i; j < CHAR_LENGTH; j++) {
						promises.push(new Promise((resolve, reject) => {
							let targetKey = chars.slice(i, j+1).join('');
							dic.openCursor(targetKey).onsuccess = e => {
								let cursor = e.target.result;
								if (cursor) {
									cursor.value.start = i + 1;
									cursor.value.end = j + 2;
									targets.push(cursor.value);
									cursor.continue();
								} else {
									for (let k = 0; k < unkDic.length; k++) {
										if (unkDic[k].regexp.test(targetKey)) {
											targets.push({
												word: targetKey,
												id: unkDic[k].id,
												cost: unkDic[k].cost,
												pos: unkDic[k].pos,
												start: i + 1,
												end: j + 2,
												note: k && '未知語'
													|| targetKey === '\n' && '改行'
													|| targetKey === '\t' && 'タブ'
													|| '空白'
											});
										}
									}
									resolve();
								}
							}
						}));
					}
				}
				Promise.all(promises).then(() => {
					targets.push(Object.assign({}, BOS), Object.assign({}, EOS, {
						start: CHAR_LENGTH + 1,
						end: CHAR_LENGTH + 2,
					}));
					this.words = targets.sort((a, b) => {
						return a.start - b.start || a.end - b.end;
					});
					resolve(this.words);
				}, reject);
			};
		});
	}
	tokenize() {
		let words = this.words;
		let len = words.length;
		let mCosts = new Array(len).fill().map(() => new Array(len));
		return new Promise((resolve, reject) => {
			let promises = [];
			indexedDB.open(DIC_NAME).onsuccess = e => {
				let db = e.target.result;
				let matrix = db.transaction(['matrix'], 'readonly').objectStore('matrix');
				for (let x = 0; x < len; x++) {
					for (let y = 0; y < len; y++) {
						if (words[x].end === words[y].start) {
							promises.push(new Promise((resolve, reject) => {
								matrix.get([words[x].id, words[y].id]).onsuccess = e => {
									mCosts[y][x] = e.target.result.cost;
									resolve();
								};
							}));
						} else {
							mCosts[y][x] = Infinity;
						}
					}
				}
				Promise.all(promises).then(() => {
					let vertex = new Array(len).fill().map(() => ({
						cost: Infinity,
						next: -1,
						visited: false,
					}));
					vertex[len-1] = {
						cost: words[len-1].cost, // 0
						next: len,
						visited: false,
					};
					search:
					while (true) {
						let min = Infinity;
						for (let i = 0; i < len; i++) {
							if (!vertex[i].visited && vertex[i].cost < min) min = vertex[i].cost;
						}
						if (min === Infinity) break;
						for (let y = 0; y < len; y++) {
							if (vertex[y].cost === min) {
								for (let x = 0; x < len; x++) {
									let sum = mCosts[y][x] + words[y].cost + min;
									if (sum < vertex[x].cost) {
										vertex[x].cost = sum;
										vertex[x].next = y;
									}
								}
								vertex[y].visited = true;
							}
						}
					}
					let index = 0, path = new Path();
					path.cost = vertex[index].cost;
					while (index < len) {
						let word = words[index];
						if (!word) throw new Error();
						path.push(word);
						index = vertex[index].next;
					}
					resolve(path.format());
				}).catch(() => reject());
			};
		});
	}
}

(function () {
	/*
		Setting Unknown Word Dictionary
	*/
	let unkDicAll, unkDicNormal;
	fetch(DIC_NAME + '.unknown.bin').then(res => res.arrayBuffer()).then(buf => {
		let array = new Uint16Array(buf);
		unkDicAll = new Array(array.length / 4);
		for (let i = 0; i < unkDicAll.length; i++) {
			unkDicAll[i] = Object.assign({}, UNKNOWN_DEFINITION[array[i*4+0]], {
				id: array[i*4+1],
				cost: array[i*4+2],
				pos: array[i*4+3],
			});
		}
		unkDicNormal = unkDicAll.filter(v => v.invoke);
	});

	/*
		DOM
	*/
	let buttons = document.getElementsByTagName('button');
	let dicstatus = document.getElementById('dicstatus');
	let form = document.forms[0];
	let textarea = form[0];
	let output = document.getElementById('output');
	
	// Saving Dictionary
	buttons[0].onclick = () => {
		buttons[0].className = 'active';
		buttons[0].disabled = true;
		buttons[1].disabled = true;
		buttons[2].disabled = true;
		dicstatus.value = '辞書を読み込んでいます';
		const WORKER = new Worker('setdic.js');
		WORKER.onmessage = e => {
			WORKER.onmessage = e => {
				WORKER.terminate();
				buttons[0].className = '';
				buttons[0].disabled = false;
				buttons[1].disabled = false;
				buttons[2].disabled = false;
				dicstatus.value = '辞書の読み込みが完了しました';
			};
		};
		WORKER.onerror = e => {
			WORKER.terminate();
			buttons[0].className = '';
			buttons[0].disabled = false;
			buttons[1].disabled = false;
			buttons[2].disabled = false;
			dicstatus.value = 'エラーが発生しました';
		};
		WORKER.postMessage(DIC_NAME);
	};
	
	// Deleting Dictionary
	buttons[1].onclick = () => {
		buttons[0].disabled = true;
		buttons[1].className = 'active';
		buttons[1].disabled = true;
		buttons[2].disabled = true;
		dicstatus.value = '辞書を削除しています';
		let req = indexedDB.deleteDatabase(DIC_NAME);
		req.onsuccess = () => {
			buttons[0].disabled = false;
			buttons[1].className = '';
			buttons[1].disabled = false;
			buttons[2].disabled = false;
			dicstatus.value = '辞書を削除しました';
		};
	};
	
	// Tokenization
	form.onsubmit = () => {
		buttons[0].disabled = true;
		buttons[1].disabled = true;
		buttons[2].className = 'active';
		buttons[2].disabled = true;
		dicstatus.value = '解析中です';
		let outputHTML = '';
		let inputs = textarea.value.split(/(.*?。)\s*/);
		let lattices = [];
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i]) lattices.push(new Lattice(inputs[i]));
		}
		let promises = lattices.map(lattice => new Promise((resolve, reject) => {
			lattice.lookup(unkDicNormal || [])
				.then(() => lattice.tokenize())
				.then(v => resolve(v))
				.catch(() => lattice.lookup(unkDicAll || []))
				.then(() => lattice.tokenize())
				.then(v => resolve(v))
				.catch(() => reject());
		}));
		Promise.all(promises).then(values => {
			for (let i = 0; i < values.length; i++) {
				for (let j = 0; j < values[i].length; j++) {
					let word = values[i][j];
					outputHTML += '<tr>'
						+ '<th>' + word.word
						+ '<td>' + POSID[word.pos].join('-')
						+ '<td>' + (word.cjg || []).join('-')
						+ '<td>' + (word.base || word.cjg && word.word || '')
						+ '<td>' + (word.orth || word.word)
						+ '<td>' + (word.pron || word.orth || word.word)
						+ '<td>' + (word.note || '');
				}
			}
			output.innerHTML = outputHTML;
			dicstatus.value = '解析が終了しました';
		}, e => {
			dicstatus.value = '解析中にエラーが発生しました';
		}).then(() => {
			buttons[0].disabled = false;
			buttons[1].disabled = false;
			buttons[2].className = '';
			buttons[2].disabled = false;
		});
		return false;
	};
})();