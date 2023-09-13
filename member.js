function skillsMember() {
    var skills = document.getElementById("skills");
    var skillsMember = document.getElementById("skillsMember");
    var skillsMemberValue = skillsMember.value;
    var skillsMemberText = skillsMember.options[skillsMember.selectedIndex].text;
    var skillsMemberOption = document.createElement("option");
    skillsMemberOption.text = skillsMemberText;
    skillsMemberOption.value = skillsMemberValue;
    skills.add(skillsMemberOption);
    skillsMember.remove(skillsMember.selectedIndex);
}