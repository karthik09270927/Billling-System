export const AdminHeaderBoxStyle = {
    position: "fixed",
    top: 90,
    left: 16,
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: 1000,
}

export const AdminHeaderSubBoxStyle = {
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "height 0.4s ease, padding 0.4s ease",
}

export const AdminHeaderIconStyle = {
    position: "fixed",
    top: 80,
    left: 16,
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    zIndex: 1000,
}

export const AdminHeaderIconEditStyle = {
    backgroundColor: "rgb(238, 255, 226)",
    borderRadius: "20px",
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: "none",
        },
    },
}

export const TextFieldStyle = {
    backgroundColor: "rgb(238, 255, 226)",
    borderRadius: "20px",
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            border: "none",
        },
    },
}

export const cardBoxStyle = {
    display: "flex",
    gap: 2,
    overflowX: "auto",
    whiteSpace: "nowrap",
    p: 1,
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
        display: "none",
    },
    flex: 1,
}

export const BoxcardStyle = {
    minWidth: "120px",
    maxWidth: "140px",
    height: "150px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "box-shadow 0.3s",
    position: "relative",
}

export const editIconCardStyle = {
    position: "absolute",
    borderRadius: "0% 30% 0% 70%",
    right: "0px",
    backgroundColor: "#74d52b",
    zIndex: 1,
    '&:hover': {
        backgroundColor: "rgb(169, 252, 91)",
    },
}

export const madalCardStyle = {
    minWidth: "120px",
    maxWidth: "140px",
    height: "150px",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#F9F9F9",
    cursor: "pointer",
    transition: "box-shadow 0.3s",
}

export const modalBoxStyle = {
    height: "90px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: "12px 12px 0 0",
}

export const modalBoxStyle2 = {
    backgroundColor: "#FBFBE5",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    width: "400px",
    textAlign: "center",
}

export const addProductBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    mb: 3,
}

export const uploadImageStyle = {
    width: "150px",
    height: "150px",
    backgroundColor: "#F0F0F0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "1px dashed #74d52b",
    overflow: "hidden",
}