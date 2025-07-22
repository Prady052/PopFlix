import { useEffect } from "react";

export function useKey(key, action) {
    useEffect(() => {
        function callback(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
                console.log("closed");
            }
        }
        document.addEventListener("keydown", callback);

        // if we dont do this each time a component is mount a new eventlistner 
        // is add to DOM which causes multiple callbacks
        //so to avoid that we return a clean up function
        return function () {
            document.removeEventListener("keydown", callback)
        }
    }, [action, key])
}