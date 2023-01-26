let roomImgSrc = ['rooms/threeway.jpg', 'rooms/threeway.jpg', 'rooms/threeway.jpg', 'rooms/threeway.jpg', 'rooms/threeway.jpg', 'rooms/threeway.jpg',
'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 
'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 'rooms/turn.jpg', 
'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 
'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg', 'rooms/straight.jpg']
roomImgSrc.sort(() => 0.5 - Math.random())
let gridItems = document.querySelectorAll('#grid div')
let rooms = []
let roomsData = []

const rot = ['rotate(0deg)', 'rotate(90deg)', 'rotate(180deg)', 'rotate(270deg)']

let fixElements = 
[{src:'rooms/turn.jpg', turn: 180}, {src:'rooms/threeway.jpg', turn: 180}, {src:'rooms/threeway.jpg', turn: 180}, {src:'rooms/turn.jpg', turn:  270},
{src:'rooms/threeway.jpg', turn: 180}, {src:'rooms/threeway.jpg', turn:  90}, {src:'rooms/threeway.jpg', turn: 180}, {src:'rooms/threeway.jpg', turn:  270},
{src:'rooms/threeway.jpg', turn:  90}, {src:'rooms/threeway.jpg', turn:  0}, {src:'rooms/threeway.jpg', turn:  270}, {src:'rooms/threeway.jpg', turn:  270},
{src:'rooms/turn.jpg', turn:  90}, {src:'rooms/threeway.jpg', turn:  0}, {src:'rooms/threeway.jpg', turn:  0}, {src:'rooms/turn.jpg', turn:  0}]

let playersImgSrc = [ 'elements/player1.png', 'elements/player2.png', 'elements/player3.png', 'elements/player4.png' ]
let treasuresImgSrc = [ 'elements/t1.png', 'elements/t2.png', 'elements/t3.png', 'elements/t4.png' ]
let positions = Array.from({length: 49}, (_, i) => i + 1)
positions.sort(() => 0.5 - Math.random())

const startScreen = document.querySelector('#start-screen')
const current = document.querySelector('#current-state')
let extraRoom = document.querySelector('#extra-room')
const showActivePlayer = document.querySelector('#active-player')
const showActiveTreasure = document.querySelector('#active-treasure')
const showFound = document.querySelector('#already-found')
const playersIN = document.querySelector('#players-num')
const treasuresIN = document.querySelector('#treasures-num')
const startBtn = document.querySelector('#start')
const descBtn = document.querySelector('#desc-btn')
const doneBtn = document.querySelector('#done')
const description = document.querySelector('#description')
const game = document.querySelector('#game')

let playersNum = 2
let treasuresNum = 2

let players = []
let treasures = []

let gameOver = true
let slided = false

description.style.display = 'none'
game.style.display = 'none'

startBtn.addEventListener('click', onStart)
function onStart() {
    // get data from start screen
    playersNum = playersIN.value
    treasuresNum = treasuresIN.value
    // change what is visible
    game.style.display = 'block'
    startScreen.style.display = 'none'
    description.style.display = 'none'
    createBoard(playersNum, treasuresNum)
    players[0].active = true
    gameOver = false
    refreshData()
}

descBtn.addEventListener('click', () => {
    if(description.style.display === 'block') {
        description.style.display = 'none'
        descBtn.innerHTML = 'Show me the description'
    } else {
        description.style.display = 'block'
        descBtn.innerHTML = 'Hide the description'
    }
})

function createBoard(playersNum,treasuresNum) {
    let id = 1
    // place rooms, fix elements and arrows on game board
    for(let i = 0; i < 81; i++) {
        if(gridItems[i].classList.contains('fix')) {
            const roomImg = document.createElement('img')
            const element = fixElements.pop()
            roomImg.setAttribute('src', element.src)
            roomImg.style.transform = 'rotate(' + element.turn + 'deg)'
            roomImg.style.width = '80px'
            gridItems[i].appendChild(roomImg)
            gridItems[i].id = id.toString()
            gridItems[i].children[0].style.position = 'absolute'
            gridItems[i].children[0].style.zIndex = '-1'
            rooms[id] = gridItems[i]
            id++
        } else if(gridItems[i].classList.contains('arrow')) {
            const arrow = document.createElement('img')
            arrow.setAttribute('src', 'elements/arrow.jpg')
            arrow.style.width = '80px'
            if(gridItems[i].classList.contains('up')) {
                arrow.style.transform = 'rotate(0deg)'
            } else if(gridItems[i].classList.contains('right')) {
                arrow.style.transform = 'rotate(90deg)'
            } else if(gridItems[i].classList.contains('down')) {
                arrow.style.transform = 'rotate(180deg)'
            } else if(gridItems[i].classList.contains('left')) {
                arrow.style.transform = 'rotate(270deg)'
            }
            gridItems[i].appendChild(arrow)

            // slide rooms
            gridItems[i].addEventListener('click', () => {
                if(!slided) {
                    let first = 0
                    let step = 0
                    let j = 0
                    if(gridItems[i].classList.contains('right')) {
                        first = i+1
                        j = i+2
                        step = 1
                        function cond() { return j <= i+7 }
                    } else if(gridItems[i].classList.contains('left')) {
                        first = i-1
                        j = i - 2
                        step = -1
                        function cond() { return j >= i-7 }
                    } else if(gridItems[i].classList.contains('down')) {
                        first = i+9
                        j = i+18
                        step = 9
                        function cond() { return j <= i+63 }
                    } else if(gridItems[i].classList.contains('up')) {
                        first = i-9
                        j = i-18
                        step = -9
                        function cond() { return j >= i-63 }
                    }

                    let r1 = document.createElement('img')
                    r1.setAttribute('src', gridItems[first].children[0].getAttribute('src'))
                    r1.setAttribute('style', gridItems[first].children[0].getAttribute('style'))

                    gridItems[first].children[0].setAttribute('src', extraRoom.children[0].getAttribute('src'))
                    gridItems[first].children[0].setAttribute('style', extraRoom.children[0].getAttribute('style'))

                    for(j; cond(); j += step) {
                        let r2 = document.createElement('img')
                        r2.setAttribute('src', gridItems[j].children[0].getAttribute('src'))
                        r2.setAttribute('style', gridItems[j].children[0].getAttribute('style'))

                        gridItems[j].children[0].setAttribute('src', r1.getAttribute('src'))
                        gridItems[j].children[0].setAttribute('style', r1.getAttribute('style'))

                        r1 = r2
                        r1.setAttribute('style', r2.getAttribute('style'))
                    }

                    extraRoom.children[0].setAttribute('src', r1.getAttribute('src'))
                    extraRoom.children[0].setAttribute('style', r1.getAttribute('style'))

                    slided = true
                } else {
                    alert("Csak egy szobát csúsztathatsz be körönként!")
                }
            })
        } else if(gridItems[i].classList.contains('blank')) {
            const blank = document.createElement('img')
            blank.setAttribute('src', 'elements/blank.jpg')
            blank.style.width = '80px'
        } else {
            addRandomRoom(gridItems[i], id)
            gridItems[i].id = id.toString()
            rooms[id] = gridItems[i]
            id++
        }
    }
    // extra element
    const extra = document.createElement('img')
    extra.setAttribute('src', roomImgSrc.pop())
    extra.style.transform = 'rotate(0deg)'
    extra.style.width = '80px'
    extra.style.position = 'absolute'
    extra.style.zIndex = '-1'
    extraRoom.appendChild(extra)
    extraRoom.addEventListener('click', () => {
        const deg = (parseInt(extraRoom.children[0].getAttribute('style').split('(')[1].split('d')[0]) + 90) % 360
        extraRoom.children[0].style.transform = 'rotate(' + deg + 'deg)'
    })
    // draw treasures and players
    const corners = [ gridItems[10], gridItems[16], gridItems[64], gridItems[70] ]
    for(let i = 0; i < playersNum; i++) {
        let j
        for(j = 0; j < treasuresNum; j++) {
            let treasureImg = document.createElement('img')
            let n = i*treasuresNum + j
            treasureImg.setAttribute('src', treasuresImgSrc[i])
            treasureImg.id = 't' + (n+1).toString()
            treasureImg.style.width = '40px'
            treasureImg.style.position = 'relative'
            treasureImg.style.zIndex = '2'
            treasureImg.style.display = 'none'
            let x = positions.pop()
            rooms[x].appendChild(treasureImg)

            let treasure = { id: treasureImg.id, icon: treasureImg,  pos: parseInt(rooms[x].id), acquired: false }
            treasures.push(treasure)
        }
        let playerImg = document.createElement('img')
        playerImg.setAttribute('src', playersImgSrc[i])
        playerImg.id = 'player' + (i+1).toString()
        playerImg.style.width = '40px'
        playerImg.style.position = 'relative'
        playerImg.style.zIndex = '1'
        corners[i].appendChild(playerImg)

        let player = { id: i+1, icon: playerImg,  pos: parseInt(corners[i].id), active: false, toAcquire: treasures.slice(i*treasuresNum, (i+1)*treasuresNum), startPos: parseInt(corners[i].id) }
        player.toAcquire[player.toAcquire.length-1].icon.style.display = 'block'
        players.push(player)
    }
    refreshData()
}

function addRandomRoom(r, id) {
    let roomImg = document.createElement('img')
    let which = roomImgSrc.pop()
    roomImg.setAttribute('src', which)
    const n = Math.floor(Math.random()*4)
    roomImg.style.transform = 'rotate(' + n*90 + 'deg)'
    roomImg.style.width = '80px'
    roomImg.style.position = 'absolute'
    roomImg.style.zIndex = '-1'
    r.appendChild(roomImg)
}

document.addEventListener('keydown', (e) => {
    if(players.filter(p => p.active).length !== 0 && !gameOver) {
        if(!slided) {
            alert('Slide in the given room first!')
        } else {
            let player = players.filter(p => p.active)[0]
            let playerImg = player.icon
            rooms[player.pos].removeChild(playerImg)
            if (e.key === 'ArrowRight' && player.pos % 7 !== 0 && showExits(rooms[player.pos].children[0]).filter(e => e === 3).length !== 0 && showExits(rooms[player.pos+1].children[0]).filter(e => e === 1).length !== 0) {
                player.pos += 1
            } else if (e.key === 'ArrowLeft' && player.pos % 7 !== 1 && showExits(rooms[player.pos].children[0]).filter(e => e === 1).length !== 0 && showExits(rooms[player.pos-1].children[0]).filter(e => e === 3).length !== 0) {
                player.pos -= 1
            } else if (e.key === 'ArrowDown' && player.pos < 43 && showExits(rooms[player.pos].children[0]).filter(e => e === 4).length !== 0 && showExits(rooms[player.pos+7].children[0]).filter(e => e === 2).length !== 0) {
                player.pos += 7
            } else if (e.key === 'ArrowUp' && player.pos > 7 && showExits(rooms[player.pos].children[0]).filter(e => e === 2).length !== 0 && showExits(rooms[player.pos-7].children[0]).filter(e => e === 4).length !== 0) {
                player.pos -= 7
            }
            playerImg.style.zIndex = '1'
            playerImg.style.position = 'relative'
            rooms[player.pos].appendChild(playerImg)
            if(player.toAcquire.length !== 0) {
                let activeTreasure = player.toAcquire[player.toAcquire.length-1]
                if(rooms[player.pos].children[1] === activeTreasure.icon) {
                    rooms[player.pos].removeChild(activeTreasure.icon)
                    player.toAcquire.pop()
                    if(player.toAcquire.length !== 0) {
                        player.toAcquire[player.toAcquire.length-1].icon.style.display = 'block'
                    }
                    console.log(player.toAcquire)
                }
            } else if(player.pos === player.startPos) {
                gameOver = true
                alert('Game over! The winner is: ' + player.icon.id + '! Congratulations!')
                game.style.display = 'none'
                startScreen.style.display = 'block'
            }
        }
        refreshData()
    }
})

doneBtn.addEventListener('click', () => {
    if(players.filter(p => p.active).length !== 0 && !gameOver) {
        if(!slided) {
            alert("Slide in the given room first!")
        } else {
            let player = players.filter(p => p.active)[0]
            player.active = false
            if(player.id === players.length) {
                players[0].active = true
            } else {
                players[player.id].active = true
            }
            slided = false
            refreshData()
        }
    }
})

function refreshData() {
    if(players.filter(p => p.active).length !== 0 && !gameOver) {
        let player = players.filter(p => p.active)[0]
        showActivePlayer.innerHTML = 'Current player: ' + player.icon.id
        showFound.innerHTML = 'Treasures found: ' + (treasures.length/players.length - player.toAcquire.length).toString()
        if(player.toAcquire.length !== 0) {
            showActiveTreasure.innerHTML = 'Treasure to find: ' + player.toAcquire[player.toAcquire.length-1].id + ', place: field' + player.toAcquire[player.toAcquire.length-1].pos
        } else {
            showActiveTreasure.innerHTML = 'All your treasures are collected! Go back to your starting point: field' + player.startPos
        }
    }
}

function showExits(roomImg) {
    let src = roomImg.getAttribute('src')
    let rotDeg = parseInt(roomImg.getAttribute('style').split('(')[1].split('d')[0])
    if(src === 'rooms/threeway.jpg') {
        switch (rotDeg) {
            case 0: return [1,3,4]
            case 90: return [1,2,4]
            case 180: return [1,2,3]
            case 270: return [2,3,4]
            default: return []
        }
    } else if(src === 'rooms/turn.jpg') {
        switch (rotDeg) {
            case 0: return [3,4]
            case 90: return [1,4]
            case 180: return [1,2]
            case 270: return [2,3]
            default: return []
        }
    } else if(src === 'rooms/straight.jpg') {
        switch (rotDeg) {
            case 0:
            case 180: return [1,3]
            case 90:
            case 270: return [2,4]
            default: return []
        }
    }
}