const member = {
  _id: document.getElementById("_id"),
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  telephone: document.getElementById("telephone"),
  select: document.getElementById("select"),
  form: document.getElementById("memberForm"),
  getFormData() {
    data = new FormData(this.form);
    data.delete("select");
    return data;
  },
};

const parse = (str) => new Function(str + "()");

const createBtn = async () => {
  await submit("POST", "/api/", member.getFormData(), showMember);
  fetchAllBtn();
};

const deleteBtn = async () => {
  await submit("DELETE", "/api/" + member._id.value);
  fetchAllBtn();
};

const updateBtn = async () => {
  await submit("PATCH", "/api/" + member._id.value, member.getFormData(), showMember);
  fetchAllBtn();
};

const readBtn = () => {
  submit("GET", "/api/" + member.name.value, null, showMember);
};

const fetchAllBtn = async () => {
  await submit("GET", "/api/", null, populateSelect);
};

const showMember = (o) => {
  for (const key in o) if (key != "__v") member[key].value = o[key];
};

const selectMember = () => {
  const sl = event.target;
  const idx = sl.selectedIndex;
  const id = sl.options[idx].dataset.id;
  const members = JSON.parse(sl.dataset.all);
  if (members.length == 1 && event.type == "click") showMember(members[0]);
  else
    members.forEach((m) => {
      if (m._id == id) showMember(m);
    });
};

const populateSelect = (o) => {
  const sl = member.select;
  sl.dataset.all = JSON.stringify(o);
  while (sl.options.length > 0) sl.remove(0);
  o.forEach((e, idx) => {
    const opt = document.createElement("option");
    (opt.value = e.name), (opt.innerHTML = `${idx}: ${e.name}`), (opt.dataset.id = e._id);
    sl.appendChild(opt);
  });
  sl.disabled = sl.options.length === 0 ? true : false;
};

const makeEventListeners = () => {
  [...document.getElementsByTagName("button")].forEach((btn) =>
    btn.addEventListener("click", parse(btn.id.replace("Button", "Btn")))
  );
  member.select.addEventListener("change", selectMember);
  member.select.addEventListener("click", selectMember);
};

const submit = async (method, url, formData, responseProcessor) => {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
  const body =
    (method === "POST" || method === "PATCH") && formData instanceof FormData
      ? JSON.stringify(Object.fromEntries(formData))
      : null;
  if (method !== "GET") member.form.reset();
  const response = await fetch(url, { method, body, headers });

  if (response.ok) {
    const obj = await response.json();
    if (responseProcessor) responseProcessor(obj);
  } else alert("HTTP ERROR:" + response.status);
};

const init = () => {
  makeEventListeners();
};

init();
