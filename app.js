const express = require('express')
const ExpressError = require('./error')

const app = express()

app.get("/mean", (req, res) => {
    return res.json(mean(req.query.nums))
})

app.get('/median', (req, res) => {
    return res.json(median(req.query.nums))
})

app.get('/mode', (req, res) => {
    return res.json(mode(req.query.nums))
})



app.use((error, req, res, next) => {
    // console.log(error.msg, error.status)
    res.status(error.status).send(error.msg)
})

app.listen(3000, function () {
    console.log('App on port 3000')
})



function mean(nums) {
    let total = 0
    let numArr = nums.split(',')
    for (let i = 0; i < numArr.length; i++) {
        if (Number.isInteger(numArr[i])) { total += +numArr[i] }
        else {
            throw new ExpressError(`${numArr[i]} is not a number`, 400)
        }
    }
    return { operation: "mean", value: total / numArr.length }
}

function median(nums) {
    let total = 0
    let numArr = nums.split(',')
    for (let i = 0; i < numArr.length; i++) {
        if (!Number.isInteger(+numArr[i])) {
            throw new ExpressError(`${numArr[i]} is not a number`, 400)
        }
    }
    numArr.sort(function (a, b) { return a - b })

    let half = Math.floor(numArr.length / 2)

    if (numArr.length % 2) {
        return { operation: "median", value: numArr[half] };
    } else {
        return { operation: "median", value: (+numArr[half] + +numArr[half - 1]) / 2 }
    }
}

function mode(nums) {
    let numArr = nums.split(',')
    numArr.sort(function (a, b) { return a - b })

    let bestStreak = 1
    let bestNum = numArr[0]
    let currentStreak = 1
    let currentNum = numArr[0]

    for (let i = 1; i < numArr.length; i++) {
        if (!Number.isInteger(+numArr[i])) {
            throw new ExpressError(`${numArr[i]} is not a number`, 400)
        } else {
            if (numArr[i - 1] !== numArr[i]) {
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak
                    bestNum = currentNum
                }
                currentStreak = 0;
                currentNum = numArr[i]
            }
            currentStreak++;
        }

    }
    return { operation: "mode", value: (currentStreak > bestStreak ? currentNum : bestNum) }
}