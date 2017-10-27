pragma solidity ^0.4.0;

contract TheButton {
    uint public timeLimit;
    uint public lastPress;
    mapping(address => uint) public pressTimes;

    event ButtonPress(address pressedBy, uint time);

    function TheButton(uint timeLimit_) public {
        timeLimit = timeLimit_;
        lastPress = now;
    }

    function press(uint expectLastPress) public returns (bool) {
        // If the time limit expires, the game is over.
        if (lastPress + timeLimit < now) {
            return false;
        }

        // Don't allow users to press multiple times.
        if (pressTimes[msg.sender] != 0) {
            return false;
        }

        // Check the lastPress is the expected one so that if another user
        // presses first, this one is rejected. The user should be notified
        // that they should try again.
        if (lastPress != expectLastPress) {
            return false;
        }

        pressTimes[msg.sender] = now - lastPress;
        lastPress = now;
        ButtonPress(msg.sender, now);
        return true;
    }
}
