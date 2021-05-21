const form = {
  _id: document.getElementById("_id"),
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  telephone: document.getElementById("telephone"),
  select: document.getElementById("select"),
  formData: document.getElementById("memberForm"),
  getFormData() {
    data = new FormData(this.formData);
    data.delete("select");
    return data;
  },
};

let members = {};

const parse = (str) => new Function(str + "()");

const createBtn = async () => {
  await submit("POST", "/api/", form.getFormData(), showMember);
  fetchAllBtn();
};

const deleteBtn = async () => {
  await submit("DELETE", "/api/" + form._id.value);
  fetchAllBtn();
};

const updateBtn = async () => {
  await submit("PATCH", "/api/" + form._id.value, form.getFormData(), showMember);
  fetchAllBtn();
};

const readBtn = () => {
  submit("GET", "/api/" + form.name.value, null, showMember);
};

const fetchAllBtn = async () => {
  await submit("GET", "/api/", null, populateSelect);
};

const showMember = (o) => {
  for (const key in o) if (key != "__v") form[key].value = o[key];
};

const selectMember = () => {
  const sl = event.target;
  const idx = sl.selectedIndex;
  const id = sl.options[idx].dataset.id;
  if (members.length == 1 && event.type == "click") showMember(members[0]);
  else
    members.forEach((m) => {
      if (m._id == id) showMember(m);
    });
};

const populateSelect = (o) => {
  const sl = form.select;
  members = o;
  while (sl.options.length > 0) sl.remove(0);
  o.forEach((e, idx) => {
    const opt = document.createElement("option");
    (opt.value = e.name), (opt.innerHTML = `${idx}: ${e.name}`), (opt.dataset.id = e._id);
    sl.appendChild(opt);
  });
  sl.disabled = sl.options.length === 0 ? true : false;
  document.getElementById("fetchAllButton").hidden = sl.options.length === 0 ? false : true;
};

const makeEventListeners = () => {
  [...document.getElementsByTagName("button")].forEach((btn) =>
    btn.addEventListener("click", parse(btn.id.replace("Button", "Btn")))
  );
  form.select.addEventListener("change", selectMember);
  form.select.addEventListener("click", selectMember);
};

const submit = async (method, url, formData, responseProcessor) => {
  const headers = { Accept: "application/json", "Content-Type": "application/json" };
  const body =
    (method === "POST" || method === "PATCH") && formData instanceof FormData
      ? JSON.stringify(Object.fromEntries(formData))
      : null;
  if (method !== "GET") form.formData.reset();
  const response = await fetch(url, { method, body, headers });
  const status = document.getElementById("status");
  if (response.ok) {
    const obj = await response.json();
    status.innerHTML = `Response CODE: ${response.status} - ${response.statusText}`;
    if (responseProcessor) responseProcessor(obj);
  } else status.innerHTML = `Response CODE: ${response.status} - ${response.statusText}`;
};

const init = () => {
  makeEventListeners();
};

init();
