#!/bin/bash

test_name=$1

test_regulator() {
    times=60
    i=40
    while [ $i -le $times ]
        do
            let 'i++'
	    dfx canister call regulator add_tx "(\"${i}6ooqk-hfre5-l7so3-qke7v-bviis-gkub6-q7ahe-53u6j-dvglj-gcf6a-gae\")"
        done

}

if [ $test_name = "testRegulator" ]
then
test_regulator

else
  echo "wrong test"
fi
