import { SxProps, Theme } from "@mui/system"



export const HomeWrapper = { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }

export const countCardresponsive = {
  flex: '1 1 18%',
  '@media (max-width: 960px)': { flex: '1 1 100%' },
  '@media (max-width: 600px)': { flex: '1 1 100%' },
  marginBottom: '16px',

}

export const countCard = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }

export const countNo = { fontSize: '4rem', fontWeight: '700', marginBottom: '0px', lineHeight: '1.3' }

export const countLabel = { fontWeight: '600', marginTop: '0px', lineHeight: '0.8' }

export const cardStyle = {
  boxSizing: 'content-box',
  height: '120px',
  lineHeight: '1',

}

export const settingsCardStyle = {
  boxSizing: 'content-box',
  width: '28px',
  height: '28px',
  boxShadow: 'none',
  lineHeight: '1',

}

export const settingsBackbtn = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "2px solid #ddd",
  pb: 1,
}

export const cardSetting={
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  
}

export const cardSettingStyle={
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}

export const backBtn={ px: 6, maxWidth: "100px",mr:8 }

export const settingsCardbox = {
   height: "100vh", padding: "35px", borderBottom: "1px solid #ddd" }

export const settingsCardlabel ={ mt: 1 ,fontSize: "14px"}

export const settingsCard = { 
  display: "flex", flexWrap: "wrap", mt: 6 ,justifyContent: 'space-around',
}

export const settingsCardIcon ={ fontSize: "50px", fontWeight: 600 }

export const welcomeCard = { width: '100%', padding: '10px',paddingLeft: '30px', }

export const buttonFiltercard = { width: '100%', padding: '10px',px:8 }

export const welcomeCardbox = { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 2, }

export const profileImage = { width: '80px', height: '80px', borderRadius: '50%' , objectFit:'cover' , border:''}


const isMobile = window.innerWidth < 768;
export const loginMaingrid = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  p: 2,
  ...(isMobile && {
    width: '100vw',
    height: '100vh',
    padding: 2,
  }),
}

export const welcomeMessage = { fontWeight: 'bold', marginLeft: 4, }

export const loginBox = { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }

export const loginLightBox = { height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background:'#ffffff' }

export const loginGrid = { justifyContent: 'space-between', background :'#ffffff' }

export const loginCard = { boxShadow: 'none', maxWidth: 350 }

export const loginFormbox = { justifyContent: 'flex-start', marginBottom: 4, display: 'flex' }

export const loginlogo = { width: '80px', height: '86px', justifyContent: 'flex-start', marginBottom:'1rem', }

export const signIn = { fontSize: '2.5rem', fontWeight: 'bolder',  marginBottom: '1.9rem', color:'#62c034' }

export const userNamefield = { width: '100%', mb: 4, justifyContent: 'flex-end' }

export const PasswordField = { width: '100%', mb: 4, justifyContent: 'flex-end' }

export const loginCheckbox = { flex: '2 2 auto', justifyContent: 'flex-start', fontSize: '0.8rem', '& .MuiTypography-root': { fontSize: '0.8rem' } }

export const BtnSignIn = { background: '#74d52b', color: '#fff', marginTop: '2rem', fontSize:'1rem' }

export const BtnSignup = { background: 'linear-gradient(90deg, #1c3e35 0%, #f0f9a7 100%)', color: '#fff', marginTop: '0.5rem' }


export const OrTypo = { marginY: '1rem', fontSize: '1rem', color: '#aaa', textDecoration: 'none' }


export const checkBoxForgotBox = { mb: 2, justifyContent: 'space-between', alignItems: 'center', display: 'flex', '& .MuiTypography-root': { fontSize: '1rem' } }

export const loginBackgroundImg = {
  // backgroundImage: `url(${loginback})`,
  border: '10px solid #6a994e',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
}

export const imgSpantext = { color: 'white', fontweight: 'bolder', mt: 2, fontSize: '50px' }

export const backLogo = { height: "130px", width: "130px" }

export const PasswordField4 = { width: '100%', mb: 2 }

export const tablePaper = { width: '100%', overflow: 'hidden', padding: '0px' }

export const tableContainer = {
  maxHeight: 440,
  '&::-webkit-scrollbar': { display: 'none' },
  '-ms-overflow-style': 'none',
  scrollbarWidth: 'none',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0)',
  borderRadius: '8px',
}

export const tablePaginationbox = { display: 'flex', justifyContent: 'flex-start', padding: '10px', }

export const supportTeambox={ display: "flex", justifyContent: "flex-end", p: 2 }

export const modalTextInputStyle={
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
    '& input': {
      padding: '12px 0px',
      fontSize: '14px',
    },
  },
  '& input::placeholder': {
    fontSize: '20px',
    fontWeight: '20px',
  },
}

export const modalsubInputStyle={
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
    '& input': {
      padding: '12px 0px',
    },
  },
}

export const forgotPasswordHeading: SxProps<Theme> = {
  fontWeight: 'bold',
  fontSize: '28px',
  color:'#62c034'

};

export const favouriteLocationsAnimation = {
  animation: "fadeIn 1s ease-in-out",
  animationDelay: "0.1s",
};

export const favouriteLocationsLetterAnimation = (index: number) => ({
  animation: `fadeIn ${index * 0.1}s ease-in-out`,
  animationDelay: `${index * 0.1}s`,
});
