import React from "react";

const InputBar = ({ setComment, value, showError, focusEvent }) => {
    return (
        <input
          type="text"
          defaultValue={value}
          onChange={(e) => setComment(e.target.value)}
          onFocus={focusEvent}
          placeholder="Add comment"
          className={"input_bar " + (showError && "error")}
        />
    )
}

export default InputBar;