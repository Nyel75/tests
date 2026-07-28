import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

const BASE_URL = 'http://172.20.0.121:8001';

const TOKEN = 'f172782e-e202-486b-a714-35ce673eb61c';

const params = {
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    },
};

function test(name, url) {
    const res = http.get(`${BASE_URL}${url}`, params);

    const ok = check(res, {
        [`${name} status 200`]: (r) => r.status === 200,
        [`${name} <1000ms`]: (r) => r.timings.duration < 1000,
    });

    console.log(
        `${ok ? 'PASS' : 'FAIL'} | ${name} | ${res.status} | ${Math.round(
            res.timings.duration
        )}ms`
    );

    return res;
}

export default function () {

    console.log('========== TEMPLATE MANAGER SMOKE ==========');

    test('DL Types', '/api/template-manager/dl-types');
    test('FTP Templates', '/api/template-manager/ftp-templates');
    test('Existing Names', '/api/template-manager/existing-names');
    test('Clients', '/api/template-manager/clients');
    test('Incomplete Configurations', '/api/template-manager/incomplete-configurations');
    test('Activity Logs', '/api/template-manager/activity-logs');

    // Get Templates
    const templateRes = test(
        'Templates',
        '/api/template-manager/templates'
    );

    if (templateRes.status !== 200) {
        console.log('Cannot continue template-dependent tests.');
        return;
    }

    let templates = [];

    try {
        templates = JSON.parse(templateRes.body);
    } catch (e) {
        console.log('Unable to parse template response.');
        return;
    }

    if (!Array.isArray(templates) || templates.length === 0) {
        console.log('No templates found.');
        return;
    }

    const t = templates[0];

    // Adjust these property names to your API response
    const templateId = t.id;
    const folderName = t.folder_name;
    const templateName = t.template_name;
    const templateType = t.template_type;
    const documentType = t.document_type;
    const dlType = t.dl_type;

    if (templateId) {
        test(
            'Default Test Values',
            `/api/template-manager/test-values/defaults?template_id=${templateId}`
        );
    }

    if (folderName && templateName && templateType) {
        test(
            'Test Values',
            `/api/template-manager/test-values?folder_name=${encodeURIComponent(folderName)}&template_name=${encodeURIComponent(templateName)}&template_type=${encodeURIComponent(templateType)}`
        );
    }

    if (documentType) {
        test(
            'Import Clients',
            `/api/template-manager/import-clients?doc_type=${encodeURIComponent(documentType)}`
        );
    }

    if (folderName && documentType && dlType) {
        test(
            'Letterheads',
            `/api/template-manager/incomplete-configurations/letterheads?folder_name=${encodeURIComponent(folderName)}&document_type=${encodeURIComponent(documentType)}&dl_type=${encodeURIComponent(dlType)}`
        );
    }

    console.log('============================================');
}