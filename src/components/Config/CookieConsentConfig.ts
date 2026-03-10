
import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import { isChinaArea } from '@site/src/utils/tools';
const isCn = isChinaArea();

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box wide',
      position: 'bottom left',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'bar',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  onFirstConsent: function () {
    // console.log('onFirstAction fired');
  },

  onConsent: function ({ cookie }) {
    // console.log('onConsent fired ...');
  },

  onChange: function ({ changedCategories, cookie }) {
    // console.log('onChange fired ...');
  },
  onModalReady: ({ modalName, modal }) => {
    // console.log('onModalReady fired ...', modalName, modal);
  },

  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
    },
    analytics: {
      enabled: true,

    },
  },

  language: {
    default: isCn ? 'zh' : 'en',
    translations: {
      en: {
        consentModal: {
          title: "Hello traveller, it's cookie time!",
          description:
            'Our website uses tracking cookies to understand how you interact with it. The tracking will be enabled only if you accept explicitly. <a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">Manage preferences</a>',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          //closeIconLabel: 'Close',
          footer: `
            <a href="https://www.databend.com/privacy/" target="_blank">Privacy Policy</a>
            <a href="https://www.databend.com/terms-of-service/" target="_blank">Terms of Use</a>
          `,
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Cookie Usage',
              description:
                `We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a target="_blank" href="https://www.databend.com/privacy/" class="cc__link">privacy policy</a>.`,
            },
            {
              title: 'Strictly necessary cookies',
              description: 'These cookies are essential for the website to function properly and cannot be switched off in our systems. They are usually set in response to actions made by you, such as setting your privacy preferences, logging in, or filling in forms.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Performance and Analytics cookies',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Service',
                  description: 'Description',
                  expiration: 'Expiration',
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a target="_blank" href="https://developers.google.com/analytics">Google Analytics</a>.',
                    expiration: 'Expires after 15 days',
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description:
                      'Cookie set by <a target="_blank" href="https://developers.google.com/analytics">Google Analytics</a>',
                    expiration: 'Session',
                  },
                  {
                    name: 'ko_id',
                    domain: 'Koala Analytics',
                    description:
                      'Cookie set by <a target="_blank" href="https://getkoala.com/">Koala Analytics</a>',
                    expiration: 'Session',
                  },
                  {
                    name: 'ko_sid',
                    domain: 'Koala Analytics',
                    description:
                      'Cookie set by <a target="_blank" href="https://getkoala.com/">Koala Analytics</a>',
                    expiration: 'Expires after 1 days',
                  },
                ],
              },
            },
            {
              title: 'More information',
              description:
                'For any queries in relation to my policy on cookies and your choices, please <a class="cc__link" href="mailto:hi@databend.com">contact us</a>.',
            },
          ],
        },
      },
      zh: {
        consentModal: {
          title: "探索我们的 Cookie 使用，轻松管理您的选择！",
          description:
            '我们的网站使用跟踪 cookie 来了解您与网站的互动。只有在您明确同意的情况下，跟踪功能才会启用。<a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">管理偏好</a>',
          acceptAllBtn: '全部接受',
          acceptNecessaryBtn: '全部拒绝',
          showPreferencesBtn: '管理偏好',
          footer: `
      <a href="https://www.databend.cn/privacy/" target="_blank">隐私政策</a>
      <a href="https://www.databend.cn/terms-of-service/"  target="_blank">使用条款</a>
    `,
        },
        preferencesModal: {
          title: 'Cookie 偏好设置',
          acceptAllBtn: '全部接受',
          acceptNecessaryBtn: '全部拒绝',
          savePreferencesBtn: '保存偏好',
          closeIconLabel: '关闭',
          sections: [
            {
              title: 'Cookie 使用',
              description:
                '我们使用 cookie 来确保网站的基本功能并提升您的在线体验。您可以随时选择启用或禁用每个类别。如需了解有关 cookie 和其他敏感数据的更多详情，请阅读完整的<a target="_blank" href="https://www.databend.cn/privacy/" class="cc__link">隐私政策</a>。',
            },
            {
              title: '严格必要的 cookie',
              description: '这些 Cookie 是网站正常运行所必需的，无法在我们的系统中被禁用。它们通常在您进行某些操作时设置，例如设置隐私偏好、登录或填写表单。',
              linkedCategory: 'necessary',
            },
            {
              title: '性能和分析 cookie',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: '名称',
                  domain: '服务',
                  description: '描述',
                  expiration: '有效期',
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'Google Analytics',
                    description:
                      '由 <a target="_blank" href="https://developers.google.com/analytics">Google Analytics</a> 设置的 cookie。',
                    expiration: '15 天后过期',
                  },
                  {
                    name: '_gid',
                    domain: 'Google Analytics',
                    description:
                      '由 <a target="_blank" href="https://developers.google.com/analytics">Google Analytics</a> 设置的 cookie。',
                    expiration: '会话结束',
                  },
                  {
                    name: 'ko_id',
                    domain: 'Koala Analytics',
                    description:
                      '由 <a target="_blank" href="https://getkoala.com/">Koala Analytics</a> 设置的 cookie。',
                    expiration: '会话结束',
                  },
                  {
                    name: 'ko_sid',
                    domain: 'Koala Analytics',
                    description:
                      '由 <a target="_blank" href="https://getkoala.com/">Koala Analytics</a> 设置的 cookie。',
                    expiration: '1 天后过期',
                  },
                ],
              },
            },
            {
              title: '更多信息',
              description:
                '如有关于 cookie 政策或您的选择的任何疑问，请<a class="cc__link" href="mailto:hi@databend.com">联系我们</a>。',
            },
          ],
        },
      }
    },
  },
};

export default pluginConfig;
