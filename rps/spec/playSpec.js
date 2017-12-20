function Requests(){
    this.playRound = function(p1Throw, p2Throw, observer){
        new PlayRoundRequest(p1Throw, p2Throw, observer).process()
    }
}

function PlayRoundRequest(p1Throw, p2Throw, observer){
    this.process = function(){
        if (invalidThrow(p1Throw) || invalidThrow(p2Throw))
            observer.invalid()
        else if (tie())
            observer.tie()
        else if (p1Wins())
            observer.p1Wins()
        else
            observer.p2Wins()
    }

    function tie() {
        return p1Throw === p2Throw
    }

    function p1Wins() {
        return (
            p1Throw === ROCK     && p2Throw === SCISSORS  ||
            p1Throw === SCISSORS && p2Throw === PAPER     ||
            p1Throw === PAPER    && p2Throw === ROCK
        )
    }

    function invalidThrow(theThrow) {
        return !VALID_THROWS.includes(theThrow)
    }


    const ROCK = "rock"
    const PAPER = "paper"
    const SCISSORS = "scissors"

    const VALID_THROWS = [ROCK, PAPER, SCISSORS]
}

describe("play round", function () {
    let observer, requests

    beforeEach(function () {
        requests = new Requests()
    })

    describe("p1 win scenarios", function () {
        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p1Wins"])
        })

        it("rock v. scissors", function () {
            requests.playRound("rock", "scissors", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("scissors v. paper", function () {
            requests.playRound("scissors", "paper", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("paper v. rock", function () {
            requests.playRound("paper", "rock", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })
    })

    describe("p2 win scenarios", function () {
        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p2Wins"])
        })

        it("scissors v. rock", function () {
            requests.playRound("scissors", "rock", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("paper v. scissors", function () {
            requests.playRound("paper", "scissors", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("rock v. paper", function () {
            requests.playRound("rock", "paper", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })
    })

    describe("tie scenarios", function () {
        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["tie"])
        })

        it("rock v. rock", function () {
            requests.playRound("rock", "rock", observer)

            expect(observer.tie).toHaveBeenCalled()
        })

        it("paper v. paper", function () {
            requests.playRound("paper", "paper", observer)

            expect(observer.tie).toHaveBeenCalled()
        })

        it("scissors v. scissors", function () {
            requests.playRound("scissors", "scissors", observer)

            expect(observer.tie).toHaveBeenCalled()
        })
    })

    describe("invalid throw scenarios", function () {
        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["invalid"])
        })

        it("rock v. <INVALID>", function () {
            requests.playRound("rock", Math.random(), observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("<INVALID> v. rock", function () {
            requests.playRound(Math.random(), "paper", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("sailboat v. sailboat", function () {
            requests.playRound("sailboat", "sailboat", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })
    })

})