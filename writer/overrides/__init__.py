import frappe
try:
    from drive.api.permissions import get_teams
except ImportError:
    def get_teams(*a, **kw): return []


def filter_templates(user):
    if user == "Administrator":
        return ""

    teams = get_teams()
    teams = ", ".join(frappe.db.escape(team) for team in teams)
    return f"""(`tabWriter Template`.`owner` = '{user}' or `tabWriter Template`.team in ({teams}))"""
