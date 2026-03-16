const firebaseConfig = {
  apiKey: "SUA_CHAVE",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJETO",
};

const hasConfig =
  firebaseConfig.apiKey !== "SUA_CHAVE" &&
  firebaseConfig.authDomain !== "SEU_DOMINIO" &&
  firebaseConfig.projectId !== "SEU_PROJETO";

if (hasConfig && window.firebase) {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
} else {
  window.db = null;
}
