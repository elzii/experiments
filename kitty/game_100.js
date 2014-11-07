var m_imageList = "brand_logo load_bar load_element number_context number_score medals blink brand_copyright new buttons text cat grassline land dust dirbuttons blob gib worm clock hit worm2 title clock text score_panel".split(" "),
    m_button_ok, m_button_start, m_button_submit, m_button_more, m_button_left, m_button_right, m_kitty, m_grassline_x, m_grassline_dx, m_grassline_timer, m_shaking, m_shaking_dy, m_dust, m_blobs, m_worms, m_worms2, m_gibs, GROUND_Y = 276,
    m_blobRed = !1,
    m_blobTimer = 0,
    m_wormTimer = 0,
    m_worm2Timer = 0,
    m_worms_marked, m_blobCount = 0,
    m_blobTotal = 0,
    m_worm2Count = 0,
    m_score, m_hit, m_clock, m_isInMenu, m_hits, m_scoreFont, m_scorePanel, m_text_ready, m_text_timeup;

function TextReady() {
    this.y = this.x = this.step = 0;
    this.w = img_text.width;
    this.h = img_text.height >> 1;
    this.visible = this.active = !1;
    this.reset = function() {
        m_text_ready.x = SCREEN_WIDTH - img_text.width >> 1;
        m_text_ready.y = (SCREEN_HEIGHT >> 1) - 102;
        m_text_ready.active = !0;
        m_text_ready.visible = !0;
        m_text_ready.step = 0
    };
    this.update = function() {
        this.step++;
        75 <= this.step && (this.visible = this.active = !1)
    };
    this.render = function(a) {
        15 <= this.step && 60 >= this.step ? a.drawImage(img_text, 0, 0, this.w, this.h, this.x, this.y, this.w, this.h) : 0 ==
            this.step % 3 && a.drawImage(img_text, 0, 0, this.w, this.h, this.x, this.y, this.w, this.h)
    }
}

function TextTimeUp() {
    this.y = this.x = this.alpha = 0;
    this.w = img_text.width;
    this.h = img_text.height >> 1;
    this.visible = this.active = !1;
    this.alphaTween = new dot_Tween;
    this.state = 0;
    this.self = this;
    this.accel_y = this.speed_y = 0;
    this.reset = function() {
        m_text_timeup.active = !0;
        m_text_timeup.visible = !0;
        m_text_timeup.x = SCREEN_WIDTH - img_text.width >> 1;
        m_text_timeup.y = (SCREEN_HEIGHT >> 1) - 102;
        m_text_timeup.alphaTween.reset(0, 1, EASE_QUAD_INOUT, 0.5);
        m_text_timeup.state = 0;
        m_text_timeup.alpha = 0;
        m_text_timeup.speed_y = -5;
        m_text_timeup.accel_y =
            1
    };
    this.update = function(a) {
        switch (this.state) {
            case 0:
                this.alphaTween.update(a);
                this.alpha = this.alphaTween.delta;
                this.y += this.speed_y;
                this.speed_y += this.accel_y;
                this.y >= (SCREEN_HEIGHT >> 1) - 102 && (this.y = (SCREEN_HEIGHT >> 1) - 102, this.accel_y = this.speed_y = 0);
                this.alphaTween.finished && (this.alphaTween.reset(0, 1, EASE_QUAD_INOUT, 1), this.state = 1);
                break;
            case 1:
                this.alphaTween.update(a);
                this.alphaTween.finished && (this.state = 2, this.alpha = 1, this.alphaTween.reset(this.y, this.y - 39, EASE_QUAD_INOUT, 0.25), m_scorePanel.reset(m_score));
                break;
            case 2:
                this.alphaTween.update(a), this.y = this.alphaTween.delta, this.alphaTween.finished && (this.state = 3)
        }
    };
    this.render = function(a) {
        a.globalAlpha = this.alpha;
        a.drawImage(img_text, 0, this.h, img_text.width, 30, Math.floor(this.x), Math.floor(this.y), img_text.width, 30);
        a.globalAlpha = 1
    }
}

function Worm2() {
    this.y = this.x = 0;
    this.w = 33;
    this.h = 21;
    this.speedx = 0;
    this.alpha = 1;
    this.step = 0;
    this.reset = function(a, b) {
        this.x = Math.floor(a);
        this.y = Math.floor(b);
        this.visible = this.active = !0;
        this.color = m_math.randomIn(0, 4);
        this.alpha = 1;
        this.flip = 0;
        this.speedx = -1;
        0 > this.x && (this.speedx = this.flip = 1)
    };
    this.disappear = function() {
        this.alpha = 0.95
    };
    this.die = function() {
        this.visible = this.active = !1;
        var a = this.x + 0.5 * this.w,
            b = this.y + this.h;
        m_gibs.next().reset(a - 0.25 * this.w, b, a, b);
        m_gibs.next().reset(a - 0.25 * this.w,
            b - 0.25 * this.h, a, b);
        m_gibs.next().reset(a - 0.1 * this.w, b - 0.1 * this.h, a, b);
        m_gibs.next().reset(a + 0.25 * this.w, b, a, b);
        m_gibs.next().reset(a + 0.25 * this.w, b - 0.25 * this.h, a, b);
        m_gibs.next().reset(a + 0.1 * this.w, b - 0.1 * this.h, a, b);
        m_kitty.killScore += 5;
        m_hits++;
        m_worm2Count--
    };
    this.update = function() {
        1 > this.alpha && (this.alpha -= 0.05, 0 >= this.alpha && (this.visible = this.active = !1, this.alpha = 0));
        this.x += this.speedx;
        3 < this.step && (this.x += this.speedx, this.x += this.speedx, this.x += this.speedx, this.step = 0);
        this.step++;
        0 < this.speedx &&
            this.x > SCREEN_WIDTH ? (this.visible = this.active = !1, m_worm2Count--) : 0 > this.speedx && -33 > this.x && (this.visible = this.active = !1, m_worm2Count--)
    };
    this.render = function(a) {
        a.globalAlpha = this.alpha;
        a.drawImage(img_worm2, 33 * this.color, 21 * this.flip, 33, 21, Math.floor(this.x), Math.floor(this.y), 33, 21);
        a.globalAlpha = 1
    }
}

function Worm() {
    this.level = this.timer = this.y = this.x = 0;
    this.w = 36;
    this.h = 18;
    this.markedId = this.color = 0;
    this.alpha = 1;
    this.disappear = function() {
        this.alpha = 0.95
    };
    this.reset = function(a, b) {
        this.x = Math.floor(a);
        this.y = Math.floor(b);
        this.level = this.timer = 0;
        this.visible = this.active = !0;
        this.color = m_math.randomIn(0, 4);
        this.alpha = 1
    };
    this.update = function(a) {
        1 > this.alpha && (this.alpha -= 0.05, 0 >= this.alpha && (this.visible = this.active = !1, this.alpha = 0));
        4 > this.level && (this.timer += a, 1 < this.timer && (this.timer = 0, this.level++))
    };
    this.die = function() {
        this.visible = this.active = !1;
        var a = this.x + 0.5 * this.w,
            b = this.y + this.h;
        m_gibs.next().reset(a - 0.25 * this.w, b, a, b);
        m_gibs.next().reset(a - 0.25 * this.w, b - 0.25 * this.h, a, b);
        m_gibs.next().reset(a - 0.1 * this.w, b - 0.1 * this.h, a, b);
        m_gibs.next().reset(a + 0.25 * this.w, b, a, b);
        m_gibs.next().reset(a + 0.25 * this.w, b - 0.25 * this.h, a, b);
        m_gibs.next().reset(a + 0.1 * this.w, b - 0.1 * this.h, a, b);
        m_kitty.killScore += 5;
        m_hits++;
        m_worms_marked[this.markedId] = !1
    };
    this.render = function(a) {
        a.globalAlpha = this.alpha;
        if (0 == this.level) a.drawImage(img_worm,
            0, 48, 36, 6, this.x, this.y + 12, 36, 6);
        else {
            a.drawImage(img_worm, 36 * this.color, 36, 36, 18, this.x, this.y, 36, 18);
            for (var b = 0; b < this.level - 1; b++) a.drawImage(img_worm, 36 * this.color, 18, 36, 18, this.x, this.y - 18 - 18 * b, 36, 18);
            a.drawImage(img_worm, 36 * this.color, 0, 36, 18, this.x, this.y - 18 - 18 * (this.level - 1), 36, 18)
        }
        a.globalAlpha = 1
    }
}

function Blob() {
    this.inShadow = !1;
    this.end_x = this.start_x = this.color = 0;
    this.load(img_blob, 36, 36, 0, 0, 36, 36, !0);
    this.accely = this.speedy = this.speedx = this.idleTimer = 0;
    this.onGround = !0;
    this.alpha = 1;
    this.disappear = function() {
        this.alpha = 0.95
    };
    this.reset = function(a, b) {
        this.x = Math.floor(a);
        this.y = Math.floor(b);
        this.inShadow = this.visible = this.active = !0;
        this.offset = 4;
        this.accely = this.speedy = this.speedx = 0;
        this.idleTimer = 0.5;
        this.start_x = this.x;
        this.start_x < 0.5 * SCREEN_WIDTH ? (this.end_x = 30 + 10 * m_math.randomIn(0,
            12) - 0.5 * this.w, this.start_x = this.end_x - 15) : (this.end_x = SCREEN_WIDTH - (30 + 10 * m_math.randomIn(0, 12)) - 0.5 * this.w, this.start_x = this.end_x + 15);
        this.x = this.start_x;
        this.color = m_math.randomIn(0, 4);
        this.alpha = 1
    };
    this.die = function() {
        this.visible = this.active = !1;
        var a = this.x + 0.5 * this.w,
            b = this.y + this.h;
        m_gibs.next().reset(a - 0.25 * this.w, b, a, b);
        m_gibs.next().reset(a - 0.25 * this.w, b - 0.25 * this.h, a, b);
        m_gibs.next().reset(a - 0.1 * this.w, b - 0.1 * this.h, a, b);
        m_gibs.next().reset(a + 0.25 * this.w, b, a, b);
        m_gibs.next().reset(a + 0.25 *
            this.w, b - 0.25 * this.h, a, b);
        m_gibs.next().reset(a + 0.1 * this.w, b - 0.1 * this.h, a, b);
        m_kitty.killScore += 20;
        m_hits++;
        m_blobCount--
    };
    this.update = function(a) {
        1 > this.alpha && (this.alpha -= 0.05, 0 >= this.alpha && (this.visible = this.active = !1, this.alpha = 0));
        if (0 != this.accely) {
            this.x += this.speedx;
            this.y += this.speedy;
            this.speedy += this.accely;
            this.inShadow && (1 <= this.speedy && 0 == this.speedx) && (this.inShadow = !1);
            if (1 > Math.abs(this.speedy) && (!this.inShadow && 0 >= m_kitty.hurt) && !(m_kitty.x + m_kitty.w < this.x || m_kitty.x > this.x + this.w ||
                m_kitty.y + 45 < this.y || m_kitty.y > this.y + this.h)) m_kitty.hurt = 30;
            this.y + this.h >= GROUND_Y && (this.y = GROUND_Y - this.h, this.idleTimer = this.inShadow ? 0.5 : 0.5 + m_math.random(), this.accely = this.speedy = this.speedx = 0, this.onGround = !0)
        } else 0 < this.idleTimer && (this.idleTimer -= a, 0 >= this.idleTimer && (this.start_x < this.end_x ? this.x >= this.end_x ? this.inShadow ? this.speedx = 0 : (this.end_x = 60 + m_math.randomIn(0, 200), this.start_x = this.x, this.start_x > this.end_x ? (this.speedx = -2, this.flip = !1) : (this.speedx = 2, this.flip = !0)) : (this.speedx =
            2, this.flip = !0) : this.x <= this.end_x ? this.inShadow ? this.speedx = 0 : (this.end_x = 60 + m_math.randomIn(0, 200), this.start_x = this.x, this.start_x > this.end_x ? (this.speedx = -2, this.flip = !1) : (this.speedx = 2, this.flip = !0)) : (this.speedx = -2, this.flip = !1), this.speedy = -6, this.accely = 0.5, this.onGround = !1))
    };
    this.render = function(a, b, c) {
        var d = 0,
            d = this.inShadow ? 8 + (0 < this.idleTimer ? 1 : 0) + this.flip * this.numberOfFrames : 2 * this.color + (0 < this.idleTimer ? 1 : 0) + this.flip * this.numberOfFrames;
        b = Math.round(this.x - this.offsetX + b);
        c = Math.round(this.y -
            this.offsetY + c);
        a.globalAlpha = this.alpha;
        a.drawImage(this.image, this.frames[d].x, this.frames[d].y, this.frameWidth, this.frameHeight, b, c, this.frameWidth, this.frameHeight);
        a.globalAlpha = 1
    }
}

function Gib() {
    this.timer = this.y = this.x = this.accely = this.speedy = this.speedx = 0;
    this.visible = this.active = !1;
    this.h = img_gib.height;
    this.w = img_gib.width;
    this.reset = function(a, b, c, d) {
        this.x = Math.floor(a - 0.5 * this.w);
        this.y = Math.floor(b - 0.5 * this.h);
        this.speedx = 0.5 * (a - c);
        this.speedy = 0.5 * (b - d);
        this.accely = 0.8;
        this.timer = 0.5;
        this.visible = this.active = !0
    };
    this.update = function(a) {
        0 <= this.timer ? (this.timer -= a, this.x += this.speedx, this.y += this.speedy, this.speedy += this.accely, this.y + this.h >= GROUND_Y && (this.speedx *=
            0.5, this.speedy *= -0.5, this.y = GROUND_Y - this.h)) : this.visible = this.active = !1
    };
    this.render = function(a) {
        a.drawImage(img_gib, Math.floor(this.x), Math.floor(this.y))
    }
}

function Kitty() {
    this.load(img_cat, 45, 81, 6, 0, 33, 81, !0);
    this.bounce = this.createAnimation("bounce", 20, !1, [0, 1, 2, 2, 1, 0]);
    this.hurt = this.killScore = 0;
    this.reset = function(a, b) {
        this.x = Math.floor(a);
        this.y = Math.floor(b);
        this.accely = this.speedy = this.speedx = 0;
        this.speedx = 3;
        this.hurt = this.killScore = 0;
        this.visible = this.active = !0;
        this.bounce.play(!0);
        this.flip = !1
    };
    this.update = function(a) {
        0 < this.hurt && (this.hurt -= 1, m_hits = 0);
        if (this.currentAnim.finished) {
            if (0 >= this.hurt && (this.y += this.speedy, this.speedy += this.accely,
                m_button_left.active && (m_button_left.isPressed ? (this.x -= this.speedx, this.flip = !0) : m_button_right.isPressed && (this.x += this.speedx, this.flip = !1)), 0 > this.x ? this.x = 0 : this.x + this.w >= SCREEN_WIDTH && (this.x = SCREEN_WIDTH - this.w), 14 < this.speedy && (this.speedy = 14), this.y + this.h >= GROUND_Y)) {
                this.y = GROUND_Y - this.h;
                this.bounce.play(!0);
                this.accely = this.speedy = 0;
                m_shaking = 0.2;
                m_dust.reset(this.x, GROUND_Y - m_dust.h);
                m_dust.blow.play(!0);
                this.killScore = 0;
                var b = m_blobs.array,
                    c;
                for (a = 0; a < b.length; a++) c = b[a], c.active &&
                    !c.inShadow && 12 > GROUND_Y - c.y - c.h && !(c.x + c.w < this.x || c.x > this.x + this.w) && c.die();
                b = m_worms.array;
                for (a = 0; a < b.length; a++) c = b[a], c.active && 0 < c.level && !(c.x + 6 + c.w - 12 < this.x || c.x + 6 > this.x + this.w) && c.die();
                b = m_worms2.array;
                for (a = 0; a < b.length; a++) c = b[a], c.active && (c.x + c.w < this.x || c.x > this.x + this.w || c.die());
                0 < this.killScore ? (1 < m_hits && (this.killScore = Math.floor(1.25 * this.killScore * (m_hits - 1))), m_scoreContextPool.next().reset(this.x + 0.5 * this.w, this.y + this.h, this.killScore, !0), m_score += this.killScore) : m_hits =
                    0
            }
        } else this.updateAnimation(a), this.currentAnim.finished && (this.speedy = -14, this.accely = 0.8)
    };
    this.render = function(a, b, c) {
        var d = this.currentAnim.currentFrame + this.flip * this.numberOfFrames;
        0 < this.hurt && 0 == this.hurt % 2 && (d += 3);
        b = Math.round(this.x - this.offsetX + b);
        c = Math.round(this.y - this.offsetY + c);
        a.drawImage(this.image, this.frames[d].x, this.frames[d].y, this.frameWidth, this.frameHeight, b, c, this.frameWidth, this.frameHeight)
    }
}
this.gameUpdate = function(a, b) {
    0 < m_shaking ? (m_shaking -= a, m_shaking_dy = -Math.floor(m_math.randomIn(0, 3))) : m_shaking_dy = 0;
    if (m_isInMenu) b.drawImage(img_brand_copyright, SCREEN_WIDTH - img_brand_copyright.width >> 1, SCREEN_HEIGHT - 33), b.drawImage(img_title, SCREEN_WIDTH - img_title.width >> 1, GROUND_Y + 30), b.drawImage(img_grassline, 0, GROUND_Y - 25 + m_shaking_dy), m_kitty.active && (m_kitty.update(a), m_kitty.render(b, 0, 0)), m_dust.active && (m_dust.updateAnimation(a), m_dust.currentAnim.finished ? (m_dust.active = !1, m_dust.visible = !1) : m_dust.render(b, 0, 0));
    else {
        m_clock += 1;
        if (1920 == m_clock)
            for (var c = 0; c < m_worms.array.length; c++) m_worms.array[c].disappear();
        else if (3720 == m_clock)
            for (c = 0; c < m_worms2.array.length; c++) m_worms2.array[c].disappear();
        else if (5520 == m_clock) {
            for (c = 0; c < m_blobs.array.length; c++) m_blobs.array[c].disappear();
            m_time.addTimeOut(0.6, m_text_timeup.reset);
            m_button_left.active = !1;
            m_button_right.active = !1
        }
        for (var d = m_blobs.array, c = 0; c < d.length; c++) d[c].active && (d[c].update(a), d[c].inShadow && d[c].render(b, 0, 0));
        if (!(5520 <= m_clock))
            if (3720 <= m_clock) {
                if (0 < m_blobTimer && (m_blobTimer -= a, 0 >= m_blobTimer)) {
                    if (15 > m_blobCount) {
                        for (var e = m_blobs.next(); e.active;) e = m_blobs.next();
                        0 == m_math.rand() % 2 ? e.reset(-42, GROUND_Y - 42) : e.reset(SCREEN_WIDTH + 42, GROUND_Y - 42);
                        m_blobCount++;
                        m_blobTotal++
                    }
                    m_blobTimer = Math.max(2 - 0.001 * (m_clock - 3720), 1)
                }
            } else if (1920 <= m_clock) {
            if (0 < m_worm2Timer && 15 > m_worm2Count && (m_worm2Timer -= a, 0 >= m_worm2Timer)) {
                for (e = m_worms2.next(); e.active;) e = m_worms2.next();
                0 == m_math.rand() % 2 ? e.reset(-33, GROUND_Y -
                    21) : e.reset(SCREEN_WIDTH, GROUND_Y - 21);
                m_worm2Count++;
                m_worm2Timer = m_math.randomIn(1, 2) - 0.5
            }
        } else if (90 <= m_clock && 0 < m_wormTimer && (m_wormTimer -= a, 0 >= m_wormTimer)) {
            for (c = 0; 3 > c;) {
                e = m_math.randomIn(0, 10);
                if (!m_worms_marked[e]) {
                    for (c = m_worms.next(); c.active;) c = m_worms.next();
                    c.reset(32 * e, GROUND_Y - 18);
                    c.markedId = e;
                    m_worms_marked[e] = !0;
                    break
                }
                c++
            }
            m_wormTimer = Math.max(2 - 0.001 * m_clock, 1.5)
        }
        b.drawImage(img_grassline, 0, GROUND_Y - 25 + m_shaking_dy);
        m_grassline_timer -= a;
        if (0 >= m_grassline_timer) {
            m_grassline_x += m_grassline_dx;
            if (6 <= m_grassline_x || 0 > m_grassline_x) m_grassline_dx = -m_grassline_dx, m_grassline_x += m_grassline_dx;
            m_grassline_timer = 0.2
        }
        m_worms.update(a);
        m_worms.render(b, 0, 0);
        m_worms2.update(a);
        m_worms2.render(b, 0, 0);
        for (c = 0; c < d.length; c++) d[c].active && !d[c].inShadow && d[c].render(b, 0, 0);
        m_kitty.active && (m_kitty.update(a), m_kitty.render(b, 0, 0));
        m_dust.active && (m_dust.updateAnimation(a), m_dust.currentAnim.finished ? (m_dust.active = !1, m_dust.visible = !1) : m_dust.render(b, 0, 0));
        m_gibs.update(a);
        m_gibs.render(b, 0, 0);
        m_button_left.active &&
            (m_button_left.update(a), m_button_left.render(b, 0, 0));
        m_button_right.active && (m_button_right.update(a), m_button_right.render(b, 0, 0));
        m_text_ready.active && (m_text_ready.update(a), m_text_ready.render(b, 0, 0));
        m_text_timeup.active && (m_text_timeup.update(a), m_text_timeup.render(b, 0, 0));
        m_scorePanel.active && (m_scorePanel.update(a), m_scorePanel.render(b, 0, 0), 2 == m_scorePanel.state && !m_button_ok.active && (m_button_submit.reset(SCREEN_WIDTH - 2 * m_button_submit.w - 30 >> 1, (SCREEN_HEIGHT >> 1) + (m_scorePanel.h >> 1) + 30),
            m_button_submit.visible = !0, m_button_ok.reset(m_button_submit.x + m_button_ok.w + 30, (SCREEN_HEIGHT >> 1) + (m_scorePanel.h >> 1) + 30), m_button_ok.visible = !0));
        120 < m_clock && 5535 > m_clock && (m_scoreFont.write(b, m_score, SCREEN_WIDTH - 12, 12, !1, 12), 2 <= m_hits && (m_scoreFont.write(b, m_hits, SCREEN_WIDTH - img_hit.width - 15, 60, !1, 4), b.drawImage(img_hit, SCREEN_WIDTH - img_hit.width - 12, 66)), b.drawImage(img_clock, 9, 9), m_scoreFont.write(b, Math.min(Math.max(Math.floor((5520 - m_clock) / 30) + 1, 0), 180), 120, 12, !0, 3))
    }
    m_button_start.active &&
        (m_button_start.update(a), m_button_start.render(b, 0, 0), m_button_start.justReleased && !m_effect.active && m_effect.reset(EFFECT_FADE_IN, 0.5, 1));
    m_button_ok.active && (m_button_ok.update(a), m_button_ok.render(b, 0, 0), m_button_ok.justReleased && !m_effect.active && m_effect.reset(EFFECT_FADE_IN, 0.5, 3));
    m_button_more.active && (m_button_more.update(a), m_button_more.render(b, 0, 0), m_button_more.justReleased && !m_effect.active && BOOSTERMEDIA_MORE_GAMES());
    m_button_submit.active && (m_button_submit.update(a), m_button_submit.render(b,
        0, 0), BOOSTERMEDIA_SUBMITSCORE(m_score), m_button_submit.justReleased && !m_effect.active && m_effect.reset(EFFECT_FADE_IN, 0.5, 3));
    m_effect.finished && (1 == m_effect.info ? (m_effect.info = -1, m_button_start.active = !1, m_button_start.visible = !1, m_button_more.active = !1, m_button_more.visible = !1, m_button_left.reset(15, SCREEN_HEIGHT - 15 - m_button_left.h), m_button_left.visible = !0, m_button_right.reset(SCREEN_WIDTH - 15 - m_button_right.w, SCREEN_HEIGHT - 15 - m_button_right.h), m_button_right.visible = !0, m_isInMenu = !1, m_time.addTimeOut(0.5,
        m_text_ready.reset), m_effect.reset(EFFECT_FADE_OUT, 0.5, 2), BOOSTERMEDIA_GAMEPLAY()) : 3 == m_effect.info && (m_effect.info = -1, gameReset(), m_effect.reset(EFFECT_FADE_OUT, 0.5, 4), BOOSTERMEDIA_MAINMENU()))
};
this.gameInit = function() {
    Blob.prototype = new dot_Sprite;
    Blob.prototype.constructor = Blob;
    Kitty.prototype = new dot_Sprite;
    Kitty.prototype.constructor = Kitty;
    m_button_start = new dot_Button;
    m_button_start.create(img_buttons, 0, 78, 120, 39);
    m_button_ok = new dot_Button;
    m_button_ok.create(img_buttons, 0, 39, 120, 39);
    m_button_more = new dot_Button;
    m_button_more.create(img_buttons, 0, 117, 120, 39);
    m_button_submit = new dot_Button;
    m_button_submit.create(img_buttons, 0, 0, 120, 39);
    m_button_left = new dot_Button;
    m_button_left.create(img_dirbuttons,
        0, 0, 66, 69);
    m_button_right = new dot_Button;
    m_button_right.create(img_dirbuttons, 66, 0, 66, 69);
    m_scoreFont = new dot_NumberFont;
    m_scoreFont.load(img_number_score, 24, 30);
    m_kitty = new Kitty;
    m_blobs = new dot_ObjectPool;
    m_blobs.create(Blob, 20);
    m_worms = new dot_ObjectPool;
    m_worms.create(Worm, 20);
    m_worms2 = new dot_ObjectPool;
    m_worms2.create(Worm2, 20);
    m_gibs = new dot_ObjectPool;
    m_gibs.create(Gib, 6);
    m_worms_marked = Array(10);
    m_text_ready = new TextReady;
    m_text_timeup = new TextTimeUp;
    m_scorePanel = new dot_ScorePanel;
    m_scorePanel.create(img_score_panel,
        "KittyBest", m_scoreFont, 5E3, 8E3, 1E4, 12E3);
    m_dust = new dot_Sprite;
    m_dust.load(img_dust, 87, 12, 27, 0, 33, 12);
    m_dust.blow = m_dust.createAnimation("blow", 20, !1, [0, 1, 2]);
    gameReset()
};
this.backgroundUpdate = function(a) {
    a.fillStyle = "#13bfff";
    a.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    a.drawImage(img_land, SCREEN_WIDTH - img_land.w >> 1, GROUND_Y - 144)
};
this.gameReset = function() {
    m_ignoreTouchMove = !1;
    m_math.randomize();
    m_kitty.reset(SCREEN_WIDTH - m_kitty.w >> 2, SCREEN_HEIGHT - m_kitty.h >> 1);
    m_grassline_x = 0;
    m_grassline_dx = 3;
    m_grassline_timer = 0.2;
    m_shaking = 0;
    m_button_submit.active = !1;
    m_button_ok.active = !1;
    m_button_start.reset(SCREEN_WIDTH - m_button_start.w - 30, GROUND_Y - 2 * m_button_start.h - 24);
    m_button_start.visible = !0;
    m_button_more.reset(m_button_start.x, m_button_start.y + m_button_start.h + 9);
    m_button_more.visible = !0;
    m_scorePanel.active = !1;
    m_scorePanel.visible = !1;
    m_text_ready.active = !1;
    m_text_timeup.active = !1;
    for (var a = 0; 10 > a; a++) m_worms_marked[a] = !1;
    m_blobTimer = 1;
    m_worm2Timer = m_wormTimer = 0.5;
    m_score = m_clock = m_worm2Count = m_blobTotal = m_blobCount = 0;
    m_isInMenu = !0
};
this.touchPressed = function(a, b) {
    m_button_ok && m_button_ok.active && (a > m_button_ok.x && a < m_button_ok.x + m_button_ok.w && b > m_button_ok.y && b < m_button_ok.y + m_button_ok.h) && (m_button_ok.pressing = !0);
    m_button_start && m_button_start.active && (a > m_button_start.x && a < m_button_start.x + m_button_start.w && b > m_button_start.y && b < m_button_start.y + m_button_start.h) && (m_button_start.pressing = !0);
    m_button_submit && m_button_submit.active && (a > m_button_submit.x && a < m_button_submit.x + m_button_submit.w && b > m_button_submit.y && b < m_button_submit.y +
        m_button_submit.h) && (m_button_submit.pressing = !0);
    m_button_more && m_button_more.active && (a > m_button_more.x && a < m_button_more.x + m_button_more.w && b > m_button_more.y && b < m_button_more.y + m_button_more.h) && (m_button_more.pressing = !0);
    m_button_left && m_button_left.active && a < SCREEN_WIDTH >> 1 && (m_button_left.pressing = !0);
    m_button_right && m_button_right.active && a > SCREEN_WIDTH >> 1 && (m_button_right.pressing = !0)
};
this.touchReleased = function(a, b) {
    m_button_ok && m_button_ok.active && (a > m_button_ok.x && a < m_button_ok.x + m_button_ok.w && b > m_button_ok.y && b < m_button_ok.y + m_button_ok.h) && (m_button_ok.pressing = !1);
    m_button_start && m_button_start.active && (a > m_button_start.x && a < m_button_start.x + m_button_start.w && b > m_button_start.y && b < m_button_start.y + m_button_start.h) && (m_button_start.pressing = !1);
    m_button_submit && m_button_submit.active && (a > m_button_submit.x && a < m_button_submit.x + m_button_submit.w && b > m_button_submit.y && b < m_button_submit.y +
        m_button_submit.h) && (m_button_submit.pressing = !1);
    m_button_more && m_button_more.active && (a > m_button_more.x && a < m_button_more.x + m_button_more.w && b > m_button_more.y && b < m_button_more.y + m_button_more.h) && (m_button_more.pressing = !1);
    m_button_left && m_button_left.active && a < SCREEN_WIDTH >> 1 && (m_button_left.pressing = !1);
    m_button_right && m_button_right.active && a > SCREEN_WIDTH >> 1 && (m_button_right.pressing = !1)
};