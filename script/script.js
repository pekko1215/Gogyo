const Gogyo = [[
    '東','青','春','生','風','角',['そう','せん'],'肝','胆','爪','目','涙','酸','筋','魂','弦','怒','呼','語','久行',
],[
    '南','赤','夏','長',['熱','暑'],'微','焦',['心臓','心包'],['小腸','三焦'],['面','色'],'舌','汗','苦','地脈','神',['洪','鈎'],'喜','笑',['噫','おく'],'久視'
],[
    '中央','黄','長夏','化','湿','宮','香','脾','胃','唇','口','涎','甘','肌肉','意','代','思','歌','呑','久坐'
],[
    '西','白','秋','収','燥','商','腥','肺','大腸','毛','鼻','涕','辛','皮','魄','毛','憂','哭','咳','久臥'
],[
    '北','黒','冬','蔵','寒','羽','腐','腎','膀胱','髪','耳','唾',['鹹','かん'],'骨','志','石','恐',['呻','しん'],'欠','久立'
]];

const Labels = {
    row:['木','火','土','金','水'],
    column:[
        '五方',
        '五色',
        '五季(五時)',
        '五能',
        '五気(五悪)',
        '五音',
        '五臭(五香)',
        '五臓',
        '五腑',
        '五華',
        '五宮(五根)',
        '五液',
        '五味',
        '五主(五体)',
        '五神',
        '五脈',
        '五志',
        '五声',
        '五病',
        '五労',
    ]
}

const $table = document.getElementById('gogyoTable');
const $tbody = document.getElementById('gogyoTableBody');
const $thead = document.getElementById('gogyoTableHead');


function initTable(){
    var tr = document.createElement('tr');

    var th = document.createElement('th');
    th.innerText = '五行';
    th.colSpan = 2;
    tr.appendChild(th);
    Labels.row.forEach(label=>{
        var th = document.createElement('th');
        th.innerText = label;
        tr.appendChild(th);
    })
    $thead.appendChild(tr);

    Labels.column.forEach((label,i)=>{
        var tr = document.createElement('tr');
        if(label == '五方'){
            var td = document.createElement('td');
            td.rowSpan = 7;
            td.innerText = '自然界';
            tr.appendChild(td)
        }
        if(label == '五臓'){
            var td = document.createElement('td');
            td.rowSpan = 13;
            td.innerText = '人体';
            tr.appendChild(td)
        }

        var td = document.createElement('td');
        td.innerText = label;
        td.classList.add('five-label')
        tr.appendChild(td)

        Gogyo.forEach((value,j)=>{
            value = value[i];
            var td = document.createElement('td');
            td.innerText = value.toString();
            td.dataset.row = j;
            td.dataset.column = i
            td.classList.add('cell')
            tr.appendChild(td);
        })
        $tbody.appendChild(tr);
    })

}

function viewAll(){

}


initTable();

var isShowModal = false;

const $modal = document.getElementById('modal');
const $modalLabel = document.getElementById('modalLabel');
const $modalTh = document.getElementById('modalTh');
const $modalInput = document.getElementById('modalInput');
const $modalOK = document.getElementById('modalOK');
const $modalCancel = document.getElementById('modalCancel');
const $modalClose = document.getElementById('modalClose');
const $modalCat = document.getElementById('modalCat');
const $modalCatWrap = document.getElementById('modalCatWrap');

const colorIndexies = ['rgb(255, 243, 204)','rgb(255, 200, 200)','#ccc','rgb(251, 255, 212)','rgb(214, 230, 255)'];

function showModal({column,row,value}){
    var rowLabel = Labels.row[row];
    var columnLabel = Labels.column[column];
    $modalLabel.innerText = columnLabel;
    $modalTh.innerText = rowLabel;
    $modalInput.innerText = '';


    $modalOK.classList.remove('hidden');
    $modalCancel.classList.remove('hidden');
    $modalClose.classList.add('hidden');

    $modalCat.classList.add('animeview-off');
    $modalCat.classList.remove('animeview-on');

    getCatTags($modalCatWrap);


    $modalInput.style.backgroundColor = colorIndexies[row];

    isShowModal = true;
    $modal.classList.remove('hidden');

    $modalInput.focus();

    var okHnadler,cancelHanler;

    $modalCancel.addEventListener('click',cancelHanler = ()=>{
        $modalOK.removeEventListener('click',okHnadler);
        hiddenModal();
    },{once:true});


    $modalOK.addEventListener('click',okHnadler = async()=>{
        var flag = false;
        var input = $modalInput.innerText;
        if(Array.isArray(value)){
            if(value.includes(input)){
                flag = true;
            }
        }else{
            if(input === value){
                flag = true;
            }
        }
        if(flag){
            $modalOK.classList.add('hidden');
            $modalCancel.classList.add('hidden');
            $modalClose.classList.remove('hidden');

            $modalCat.classList.remove('animeview-off');
            $modalCat.classList.add('animeview-on');

            $modalOK.removeEventListener('click',okHnadler);
            $modalCancel.removeEventListener('click',cancelHanler);

            $modalClose.addEventListener('click',()=>{
                hiddenModal();
            },{once:true});

            document.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`).innerText = value;

        }else{
            $modal.classList.add('incorrect');
            await sleep(500);
            $modal.classList.remove('incorrect');
        }
    })
}

async function sleep(n){
    return new Promise(r=>setTimeout(r,n))
}

function hiddenModal(){
    $modal.classList.add('hidden');
    isShowModal = false;
}

$tbody.addEventListener('click',(e)=>{
    if(isShowModal) return;
    var {target} = e;
    if(target.className != 'cell') return;
    var {row,column} = target.dataset;
    var value = Gogyo[row][column];

    showModal({
        row,column,value
    })

})

$modalInput.addEventListener('keydown',e=>{
    if(e.keyCode == 13) {
        $modalOK.click();
        e.preventDefault();
    }
})


const $showAll = document.getElementById('showAll');
const $random = document.getElementById('random');
const $reset = document.getElementById('reset');

$showAll.addEventListener('click',()=>{
    [...document.querySelectorAll('.cell')].forEach(e=>{
        var {row,column} = e.dataset;
        var value = Gogyo[row][column];
        e.innerText = value;
    })
})

$reset.addEventListener('click',()=>{
    [...document.querySelectorAll('.cell')].forEach(e=>{
        e.innerText = '';
    })
})

$random.addEventListener('click',()=>{
    var arr = [...document.querySelectorAll('.cell:empty')];
    if(arr.length == 0){
        arr = [...document.querySelectorAll('.cell')]
    }
    console.log(arr)
    arr[Math.floor(Math.random() * arr.length)].click();
})

async function getCatTags(target){
    var raw = await (await fetch('https://api.thecatapi.com/api/images/get?format=html&results_per_page=1&type=gif')).text();
    target.innerHTML = raw;
}