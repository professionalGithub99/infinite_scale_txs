#!/bin/bash

test_name=$1

test_regulator() {
    times=1500
    i=900
    while [ $i -le $times ]
        do
            let 'i++'
	    dfx canister --network ic call regulator add_tx "($i)"
        done

}

if [ $test_name = "testRegulator" ]
then
test_regulator

else
  echo "wrong test"
fi
