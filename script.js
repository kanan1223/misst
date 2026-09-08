(() => {
  "use strict";

  function initialize() {
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) =>
      Array.from(document.querySelectorAll(selector));

    function setText(selector, value) {
      const element = $(selector);
      if (element) element.textContent = value;
    }

    function onClick(selector, handler) {
      const element = $(selector);
      if (element) element.addEventListener("click", handler);
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function scrollToSection(selector) {
      const element = $(selector);

      if (element) {
        element.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    }

    // ========================================
    // 閲覧者の番号
    // ========================================

    const number = String(Math.floor(Math.random() * 900) + 100);
    const guest = "GUEST-" + number;
    const subject = "MISST-" + number;

    let entered = false;

    setText("#visitor-id", "VISITOR / " + guest);
    setText("#test-id", guest);
    setText("#final-id", subject);

    // ========================================
    // 画面下のお知らせ
    // ========================================

    let toastTimer;

    function toast(message) {
      const element = $("#toast");
      if (!element) return;

      element.textContent = message;
      element.classList.add("show");

      window.clearTimeout(toastTimer);

      toastTimer = window.setTimeout(() => {
        element.classList.remove("show");
      }, 2200);
    }

    // ========================================
    // 見学開始
    // ========================================

    onClick("#entry-button", () => {
      entered = true;

      document.body.classList.remove("before-entry");
      document.body.classList.add("observing");

      setText("#observe-status", "PASSIVE");
      setText("#header-status", "TOUR / ACTIVE");

      toast("PUBLIC TOUR STARTED");
      scrollToSection(".sterile-corridor");
    });

    // ========================================
    // スクロールに合わせて観測表示を変更
    // ========================================

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const stage = Number(entry.target.dataset.stage);
            if (!Number.isFinite(stage)) return;

            const progress = $("#progress");

            if (progress) {
              progress.style.width =
                Math.min(100, Math.max(0, (stage / 9) * 100)) + "%";
            }

            if (!entered || stage < 3) return;

            setText(
              "#observe-status",
              stage >= 9 ? "COMPLETE" : "ACTIVE"
            );

            setText("#thought-state", "DETECTED");
            setText("#response-status", "LOW ACTIVITY DETECTED");

            if (stage >= 6) {
              setText("#header-status", "OBSERVATION / ACTIVE");
              $("#status-button")?.classList.add("alert");
            }

            if (stage >= 8) {
              setText("#visitor-id", "SUBJECT / " + subject);
            }

            if (stage >= 9) {
              setText("#header-status", "SYSTEM / REVIEW");
            }
          });
        },
        { threshold: 0.28 }
      );

      $$("[data-stage]").forEach((element) => {
        observer.observe(element);
      });
    }

    // ========================================
    // 公演の情報
    // 文章・画像を変える場合はここを編集
    // ========================================

    const records = {
      designer: {
        code: "OBSERVATION RECORD / 001",
        label: "2025 / CLOSED",
        title: "名もなきデザイナーをさがして",
        copy:
          "参加者の多くに、自分の選択を疑う反応が確認されました。\n\n" +
          "公演は終了しています。観測記録の一部のみを公開しています。",
        image: "designer.png",
        imageAlt: "名もなきデザイナーをさがして 公演ビジュアル"
      },

      silence: {
        code: "OBSERVATION RECORD / 002",
        label: "2026 / CLOSED",
        title: "沈黙の学級会",
        copy:
          "教室内において、同調に関する複数の思考反応が確認されました。\n\n" +
          "公演は終了しています。観測記録の一部のみを公開しています。",
        image: "silence.png",
        imageAlt: "沈黙の学級会 公演ビジュアル"
      }
    };

    // ========================================
    // 研究員のプロフィール
    // 文章・画像・SNSを変える場合はここを編集
    // ========================================

    const creatorProfiles = {
  kanan: {
    code: "RESEARCHER FILE / 01",
    label: "EXPERIENCE DESIGN / VISUAL CONTROL",
    title: "嘉南",
    copy:
      "担当領域\n" +
      "企画・体験設計・デザイン\n\n" +

      "参加者が物語をどのように見て、歩き、選択するのか。\n" +
      "体験全体の流れや導線を設計し、グラフィック・空間・Webなどの視覚表現へ落とし込みます。\n\n" +

      "主な観測業務\n" +
      "・公演企画、コンセプト設計\n" +
      "・没入体験の構成、参加者導線の設計\n" +
      "・グラフィック、空間、Webデザイン\n" +
      "・広報、作品世界のビジュアル管理\n\n" +

      "OBSERVATION NOTE\n" +
      "体験者の視線と行動を設計し、物語と現実の境界を曖昧にする。",
    image: "kanan.jpg",
    imageAlt: "嘉南のプロフィール画像",
    socials: [
      {
        name: "X",
        url: "https://x.com/12kanan23"
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/12kaxxn23/"
      }
    ]
  },

  tsukko: {
    code: "RESEARCHER FILE / 02",
    label: "SCENARIO / MATERIAL PRODUCTION",
    title: "つっこ",
    copy:
      "担当領域\n" +
      "企画・脚本・小道具制作\n\n" +

      "体験の中心となる物語を組み立て、登場人物の言葉や出来事を脚本として設計します。\n" +
      "さらに、物語の中に存在する資料や道具を制作し、虚構の世界に手触りを与えます。\n\n" +

      "主な観測業務\n" +
      "・公演企画、物語構成\n" +
      "・シナリオ、台詞、演出の制作\n" +
      "・謎や物語に関わる小道具の制作\n" +
      "・作品世界の設定、記録資料の制作\n\n" +

      "OBSERVATION NOTE\n" +
      "存在しない出来事に痕跡を与え、体験者の記憶に物語を残す。",
    image: "tsukko.jpg",
    imageAlt: "つっこのプロフィール画像",
    socials: []
  }
};

    // ========================================
    // 共通ポップアップ
    // ========================================

    const dialog = $("#record-dialog");
    let previousFocus = null;
    let previousOverflow = "";

    function getSocialContainer() {
      if (!dialog) return null;

      let container = dialog.querySelector("#dialog-socials");

      // HTMLにSNS欄がなくても自動で追加
      if (!container) {
        container = document.createElement("div");
        container.id = "dialog-socials";

        const copy = dialog.querySelector("#dialog-copy");

        if (copy) {
          copy.insertAdjacentElement("afterend", container);
        } else {
          const content = dialog.querySelector(".dialog-content");
          (content || dialog).appendChild(container);
        }
      }

      container.style.display = "flex";
      container.style.flexWrap = "wrap";
      container.style.gap = "10px";
      container.style.marginTop = "24px";

      return container;
    }

    function openDialog(data) {
      if (!data) return;

      if (!dialog || typeof dialog.showModal !== "function") {
        console.error(
          'ポップアップを開けません。index.htmlの <dialog id="record-dialog"> を確認してください。'
        );

        toast("ポップアップのHTMLを確認してください。");
        return;
      }

      setText("#dialog-code", data.code || "");
      setText("#dialog-label", data.label || "");
      setText("#dialog-title", data.title || "");
      setText("#dialog-copy", data.copy || "");

      const copy = $("#dialog-copy");

      if (copy) {
        copy.style.whiteSpace = "pre-line";
      }

      const image = $("#dialog-image");

      if (image) {
        image.hidden = !data.image;

        if (data.image) {
          image.src = data.image;
          image.alt = data.imageAlt || data.title || "";
        } else {
          image.removeAttribute("src");
          image.alt = "";
        }
      }

      const socialContainer = getSocialContainer();

      if (socialContainer) {
        socialContainer.replaceChildren();

        const socials = data.socials || [];
        socialContainer.style.display = socials.length ? "flex" : "none";

        socials.forEach((social) => {
          const link = document.createElement("a");

          link.href = social.url;
          link.textContent = social.name + "　↗";
          link.target = "_blank";
          link.rel = "noopener noreferrer";

          link.style.padding = "10px 16px";
          link.style.border = "1px solid currentColor";
          link.style.fontSize = "12px";
          link.style.textDecoration = "none";

          socialContainer.appendChild(link);
        });
      }

      if (!dialog.open) {
        previousFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;

        dialog.showModal();
        document.body.style.overflow = "hidden";
      }
    }

    // 公演ボタン
    $$("[data-record]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openDialog(records[button.dataset.record]);
      });
    });

    // 研究員ボタン
    $$("[data-creator]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openDialog(creatorProfiles[button.dataset.creator]);
      });
    });

    // 非公開記録
    onClick("#restricted", () => {
      openDialog({
        code: "RESTRICTED FILE / 000",
        label: "ACCESS LOG / ANOMALY",
        title: "この記録を開くことは、想定されていません。",
        copy:
          "閲覧者による自発的な探索行動を確認。\n" +
          "好奇心反応：正常。\n\n" +
          "何も見なかったことにして、退出してください。"
      });
    });

    // ヘッダーの状態表示
    onClick("#status-button", () => {
      openDialog({
        code: "SYSTEM LOG / CURRENT SESSION",
        label: "OBSERVATION STATUS",
        title: entered
          ? "観測は正常に進行しています。"
          : "観測は開始されていません。",
        copy: entered
          ? "識別番号：" + subject +
            "\n思考活動：検出済み\n解析結果：分類不能"
          : "公開見学経路から施設内へお進みください。"
      });
    });

    // ポップアップを閉じる
    if (dialog) {
      onClick("#dialog-close", () => {
        dialog.close();
      });

      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;

        const rect = dialog.getBoundingClientRect();

        const outside =
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom;

        if (outside) dialog.close();
      });

      dialog.addEventListener("close", () => {
        document.body.style.overflow = previousOverflow;

        const socials = dialog.querySelector("#dialog-socials");

        if (socials) {
          socials.replaceChildren();
          socials.style.display = "none";
        }

        if (previousFocus instanceof HTMLElement) {
          previousFocus.focus();
        }
      });
    }

    // ========================================
    // 標本カードの文字切り替え
    // ========================================

    const sampleWords = [
      "思考",
      "記憶",
      "疑念",
      "選択",
      "観測",
      "あなた"
    ];

    const sampleWord = $("#sample-word");
    const sampleWordNumber = $("#sample-word-number");

    // 過去のID表記にも対応
    const sampleCore =
      $("#word-sample-core") ||
      $("#word-s-core") ||
      sampleWord?.closest(".sample-core");

    if (sampleWord && sampleCore) {
      let currentWord = 0;
      let changing = false;

      function renderSampleWord() {
        sampleWord.textContent = sampleWords[currentWord];

        sampleWord.classList.toggle(
          "subject-word",
          sampleWords[currentWord] === "あなた"
        );

        if (sampleWordNumber) {
          sampleWordNumber.textContent =
            "SAMPLE " +
            String(currentWord + 1).padStart(2, "0") +
            " / " +
            String(sampleWords.length).padStart(2, "0");
        }
      }

      function changeSampleWord() {
        if (changing) return;

        changing = true;
        sampleWord.classList.add("changing");

        window.setTimeout(() => {
          currentWord = (currentWord + 1) % sampleWords.length;

          renderSampleWord();

          sampleWord.classList.remove("changing");
          changing = false;
        }, reduceMotion ? 0 : 300);
      }

      renderSampleWord();

      sampleCore.addEventListener("click", changeSampleWord);

      window.setInterval(() => {
        if (!document.hidden) changeSampleWord();
      }, 2800);
    }

    // ========================================
    // 思考反応試験
    // 質問を変える場合はここを編集
    // ========================================

    const questions = [
      {
        text: "誰も見ていなかった出来事は、\nなかったことになると思いますか。",
        answers: ["なると思う", "ならないと思う"]
      },
      {
        text: "沈黙は、\n同意だと思いますか。",
        answers: ["同意である", "同意ではない"]
      },
      {
        text: "脳がない方が、\n幸せだと思いますか。",
        answers: ["そう思う", "そう思わない"]
      }
    ];

    const questionPanel = $("#question-panel");
    const questionText = $("#question-text");
    const recorded = $("#recorded");

    const answerButtons = questionPanel
      ? Array.from(questionPanel.querySelectorAll("[data-answer]"))
      : [];

    if (
      questionPanel &&
      questionText &&
      recorded &&
      answerButtons.length >= 2
    ) {
      let questionIndex = 0;
      let processing = false;
      let completed = false;

      function showQuestion() {
        const question = questions[questionIndex];

        setText(
          "#question-number",
          "QUESTION / " + String(questionIndex + 1).padStart(2, "0")
        );

        questionText.textContent = question.text;
        questionText.style.whiteSpace = "pre-line";

        answerButtons.forEach((button, index) => {
          button.replaceChildren(
            document.createTextNode(question.answers[index] || "")
          );

          const numberLabel = document.createElement("span");

          numberLabel.textContent = String(index + 1).padStart(2, "0");
          button.appendChild(numberLabel);
          button.disabled = false;
        });

        $$(".question-dots i").forEach((dot, index) => {
          dot.classList.toggle("active", index === questionIndex);
        });
      }

      function completeTest() {
        completed = true;

        setText("#observe-status", "ANALYZING");
        setText("#result-response", "UNCLASSIFIED");
        setText("#visitor-id", "SUBJECT / " + subject);

        const pulse = document.createElement("span");
        pulse.className = "pulse";

        const message = document.createElement("p");
        message.textContent = "思考反応を検出しました。";

        const label = document.createElement("small");
        label.className = "mono";
        label.textContent = "CLASSIFICATION / UNRESOLVED";

        recorded.replaceChildren(pulse, message, label);

        const result = $("#result");

        if (result) {
          result.hidden = false;

          const resultButton = document.createElement("button");

          resultButton.type = "button";
          resultButton.textContent = "観測結果を見る　→";

          resultButton.style.display = "block";
          resultButton.style.margin = "24px auto 0";
          resultButton.style.padding = "12px 20px";
          resultButton.style.border = "1px solid currentColor";
          resultButton.style.background = "transparent";
          resultButton.style.color = "inherit";
          resultButton.style.font = "inherit";
          resultButton.style.cursor = "pointer";

          resultButton.addEventListener("click", () => {
            setText("#observe-status", "COMPLETE");
            setText("#header-status", "SYSTEM / REVIEW");

            scrollToSection("#result");
          });

          recorded.appendChild(resultButton);
        }
      }

      answerButtons.forEach((button) => {
        button.addEventListener("click", () => {
          if (processing || completed) return;

          processing = true;
          entered = true;

          document.body.classList.remove("before-entry");
          document.body.classList.add("observing");

          answerButtons.forEach((answerButton) => {
            answerButton.disabled = true;
          });

          questionPanel.hidden = true;
          recorded.hidden = false;

          setText("#observe-status", "RECORDING");

          if (questionIndex === 0) {
            setText("#test-id", subject);
            setText("#visitor-id", "SUBJECT / " + subject);

            toast("IDENTIFICATION UPDATED");
          }

          // 回答の内容は保存・送信しません
          window.setTimeout(() => {
            questionIndex += 1;

            if (questionIndex < questions.length) {
              recorded.hidden = true;
              questionPanel.hidden = false;

              showQuestion();
              processing = false;
            } else {
              completeTest();
              processing = false;
            }
          }, 850);
        });
      });

      recorded.hidden = true;
      questionPanel.hidden = false;
      showQuestion();
    }
  }

  // HTMLの読み込みが終わってから動かす
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {
      once: true
    });
  } else {
    initialize();
  }
})();
// ========================================
// 実験終了の確認
// ========================================

(() => {
  const exitButton = document.getElementById("exit-button");
  const exitDialog = document.getElementById("exit-dialog");
  const exitCancel = document.getElementById("exit-cancel");
  const exitConfirm = document.getElementById("exit-confirm");

  if (!exitButton || !exitDialog) return;

  exitButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (!exitDialog.open) {
      exitDialog.showModal();
    }
  });

  exitCancel?.addEventListener("click", () => {
    exitDialog.close();
  });

  exitConfirm?.addEventListener("click", () => {
    exitDialog.classList.add("terminating");

    exitConfirm.disabled = true;
    exitConfirm.innerHTML =
      "観測記録を破棄しています" +
      "<small>TERMINATING SESSION...</small>";

    window.setTimeout(() => {
      history.replaceState(
        null,
        "",
        location.pathname + location.search + "#entry"
      );

      window.location.reload();
    }, 1400);
  });
})();
